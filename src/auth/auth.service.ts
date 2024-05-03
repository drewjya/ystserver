import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Gender, Role } from '@prisma/client';
import { unlink } from 'fs';
import { generate } from 'otp-generator';
import { hashPassword, verifyHased } from 'src/common/encrypt';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { LoginDto, RegisterDto } from './request/auth.json';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notification: NotificationService,
  ) {}

  private async getTokens(userId: number, email: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role: role },
        { expiresIn: '1d', secret: process.env.JWT_ACCESS_SECRET },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role: role },
        { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async login(params: LoginDto) {
    const { email, password } = params;
    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false, deletedAt: null },
      include: {
        picture: true,
        adminCabang: true,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }
    const isPasswordCorrect = await verifyHased({
      value: password,
      hashed: user.password,
    });
    if (!isPasswordCorrect) {
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'Password is incorrect',
      });
    }

    const token = await this.getTokens(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        picture: user.picture?.path ?? null,
        phoneNumber: user.phoneNumber,
        cabang: user.adminCabang?.id,
        isConfirmed: user.isConfirmed,
      },
    };
  }

  async register(param: RegisterDto) {
    const { email, password, gender, name, phoneNumber } = param;
    const hashedPassword = await hashPassword(password);
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: email,
        isDeleted: false,
        deletedAt: null,
      },
    });
    if (findUser) {
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'Email already registered',
      });
    }
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        gender,
      },
    });

    const otp = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await this.prisma.user.update({
      where: {
        id: user.id,
        isDeleted: false,
        deletedAt: null,
      },
      data: {
        otp: otp,
        email: email,
      },
    });

    await this.notification.sendEmailOtp({
      email: email,
      name: user.name,
      otpVal: otp,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      picture: null,
      isConfirmed: user.isConfirmed,
      phoneNumber: user.phoneNumber,
      cabang: null,
    };
  }

  async confirmAccount(params: { userId: number; otp: string }) {
    const { userId, otp } = params;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }

    if (user.otp === otp) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          otp: null,
          isConfirmed: true,
        },
      });
      return true;
    }
    throw new ApiException({
      status: HttpStatus.BAD_REQUEST,
      data: 'wrong otp',
    });
  }

  async setFirebaseToken(param: { userId: number; token: string }) {
    const { userId, token } = param;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_ACCEPTABLE,
        data: 'User not found',
      });
    }
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firebaseToken: token,
      },
    });
    return true;
  }

  async refreshToken(param: { userId: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: param.userId },
      include: {
        picture: true,
        adminCabang: true,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }
    const token = await this.getTokens(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        picture: user.picture?.path ?? null,
        phoneNumber: user.phoneNumber,
        cabang: user.adminCabang?.id,
        isConfirmed: user.isConfirmed,
      },
    };
  }

  async requestPassword(params: { email: string }) {
    const { email } = params;
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_ACCEPTABLE,
        data: 'user not found',
      });
    }
    const otp = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await this.prisma.user.update({
      where: {
        id: user.id,
        isDeleted: false,
        deletedAt: null,
      },
      data: {
        otp: otp,
        email: email,
      },
    });

    await this.notification.sendEmailOtp({
      email: email,
      name: user.name,
      otpVal: otp,
    });
    return true;
  }

  async forgetPassword(params: {
    otp: string;
    password: string;
    email: string;
  }) {
    const { password, email, otp } = params;
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        isDeleted: false,
        deletedAt: null,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }
    const newPassword = await hashPassword(password);

    if (user.otp === otp) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp: null,
          password: newPassword,
        },
      });
      return true;
    }
    throw new ApiException({
      status: HttpStatus.BAD_REQUEST,
      data: 'wrong otp',
    });
  }

  async changePassword(params: {
    oldPassword: string;
    newPassword: string;
    userId: number;
  }) {
    const { oldPassword, newPassword, userId } = params;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }
    const isPasswordCorrect = await verifyHased({
      value: oldPassword,
      hashed: user.password,
    });
    if (!isPasswordCorrect) {
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'Password is incorrect',
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return true;
  }

  async editProfile(params: {
    file?: Express.Multer.File;
    userId: number;
    name: string;
    phoneNumber: string;
    gender: Gender;
  }) {
    const { file, name, phoneNumber, userId, gender } = params;

    const oldUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        picture: true,
      },
    });

    if (!oldUser) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }
    if (oldUser.picture && file) {
      await this.prisma.picture.delete({
        where: {
          id: oldUser.picture.id,
        },
      });
      unlink(oldUser.picture.path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phoneNumber,
        gender,
        picture: {
          create: {
            path: file?.path,
          },
        },
      },
      include: {
        picture: true,
        adminCabang: true,
      },
    });
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      picture: user.picture?.path ?? null,
      phoneNumber: user.phoneNumber,
      cabang: user.adminCabang?.id,
      isConfirmed: user.isConfirmed,
    };
  }
}
