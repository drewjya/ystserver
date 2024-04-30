import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {
    const data = Buffer.from(process.env.FIREBASE_AUTH_KEY, 'base64').toString(
      'ascii',
    );
    const credentials = JSON.parse(data);
    console.log(credentials);

    firebase.initializeApp({
      credential: firebase.credential.cert(credentials),
    });
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
}
