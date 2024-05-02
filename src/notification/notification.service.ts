import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import * as firebase from 'firebase-admin';
import { convertDate, formatCurrency } from 'src/config/format';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  private mailToken: string;
  private otpTemplate: string;
  private urlTemplate: string;
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {
    const data = Buffer.from(process.env.FIREBASE_AUTH_KEY, 'base64').toString(
      'ascii',
    );
    const credentials = JSON.parse(data);

    firebase.initializeApp({
      credential: firebase.credential.cert(credentials),
    });
    this.otpTemplate = process.env.OTP_TEMPLATE;
    this.urlTemplate = process.env.URL_TEMPLATE;
    this.mailToken = process.env.MAIL_TOKEN;
  }

  async sendNotification(param: {
    userId: number;
    title: string;
    description: string;
  }) {
    const { userId, title, description } = param;
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
    });
    await this.prisma.notification.create({
      data: {
        title: title,
        description: description,
        userId: userId,
      },
    });

    await firebase.messaging().send({
      token: user.firebaseToken,

      notification: {
        title: title,
        body: description,
      },
      data: {
        Notification: `{\n    "Title":  "${title}",\n    "Body": "${description}"\n}`,
      },
    });

    return true;
  }

  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async sendEmailNotification(param: {
    userId: number;
    title: string;
    description: string;
    orderId: number;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: param.userId,
      },
    });
    if (!user) {
      throw new HttpException('not_found', HttpStatus.NOT_FOUND);
    }

    const order = await this.prisma.order.findUnique({
      where: {
        userId: user.id,
        id: param.orderId,
      },
      include: {
        cabang: true,
        orderDetails: {
          include: {
            treatment: {
              include: {
                category: true,
              },
            },
          },
        },
        therapist: true,
      },
    });
    if (!order) {
      throw new HttpException('order_not_found', HttpStatus.NOT_FOUND);
    }
    let body = {
      mail_template_key: this.otpTemplate,
      from: {
        address: 'noreply@ystfamily.com',
        name: 'YST Family (noreply)',
      },
      to: [
        {
          email_address: {
            address: user.email,
            name: user.name,
          },
        },
      ],
      merge_info: '',
    };
    const orderStatus = order.orderStatus;
    if (orderStatus === OrderStatus.PENDING) {
      const totalPrice = order.orderDetails.reduce((previous, curr) => {
        return previous + curr.price;
      }, 0);

      let therapist = order.therapistGender;
      if (order.therapist) {
        therapist = order.therapist.nama + `(${therapist})`;
      }
      const treatments = order.orderDetails.map((e) => {
        return {
          treatment: `${e.treatment.nama} (${e.treatment.category.nama})`,
          price: formatCurrency(e.price),
        };
      });
      const info = {
        date: convertDate(order.orderTime),
        total_price: formatCurrency(totalPrice),
        klien: order.guestGender,
        name: user.name,
        terapis: therapist,
        order_id: order.orderId,
        treatments: treatments,
      };
      body.merge_info = JSON.stringify(info);
    } else if (orderStatus === OrderStatus.CANCELLED) {
      const info = {
        orderId: order.orderId,
        name: user.name,
        title: 'CANCELLED',
        message: `Maaf order anda dengan ID ${order.orderId} telah dicancel karena anda belum mengupload bukti pembayaran`,
      };
      body.merge_info = JSON.stringify(info);
    } else if (orderStatus === OrderStatus.COMPLETE) {
      const info = {
        orderId: order.orderId,
        name: user.name,
        title: 'COMPLETED',
        message: `Order anda dengan ID ${order.orderId} telah selesai.<br/> Mohon berikan rating untuk pelayanan terapis anda.`,
      };
      body.merge_info = JSON.stringify(info);
    } else if (orderStatus === OrderStatus.CONFIRMED) {
      const info = {
        orderId: order.orderId,
        name: user.name,
        title: 'CONFIRMED',
        message: `Order anda dengan ID ${order.orderId} telah dikonfirmasi.`,
      };
      body.merge_info = JSON.stringify(info);
    } else if (orderStatus === OrderStatus.ONGOING) {
      return;
    } else if (orderStatus === OrderStatus.RESCHEDULE) {
      const info = {
        orderId: order.orderId,
        name: user.name,
        title: 'CONFIRMED',
        message: `Order anda dengan ID ${order.orderId} telah direschedule. <br/>Mohon hubungi cabang di nomor ${order.cabang.phoneNumber} atau silahkan tunggu admin kami akan menghubungi Anda.`,
      };
      body.merge_info = JSON.stringify(info);
    }

    try {
      const req = await this.http.axiosRef.post(this.urlTemplate, body, {
        headers: {
          Authorization: `${this.mailToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return req.data;
    } catch (error) {
      console.log(error, 'Error Email');
      throw error;
    }
  }

  async sendEmailOtp(params: { email: string; name: string; otpVal: string }) {
    const info = {
      name: params.name,
      OTP: params.otpVal,
      team: 'YST Family',
      product_name: 'Kode OTP',
    };
    const body = {
      mail_template_key: this.otpTemplate,
      from: {
        address: 'noreply@ystfamily.com',
        name: 'YST Family (noreply)',
      },
      to: [
        {
          email_address: {
            address: params.email,
            name: params.name,
          },
        },
      ],
      merge_info: info,
    };

    try {
      const req = await this.http.axiosRef.post(this.urlTemplate, body, {
        headers: {
          Authorization: `${this.mailToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return req.data;
    } catch (error) {
      console.log(error, 'Error Email');
      throw error;
    }
  }
}
