import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { CabangModule } from './cabang/cabang.module';
import { TreatmentModule } from './treatment/treatment.module';
import { CategoryModule } from './category/category.module';
import { CabangTreatmentModule } from './cabang-treatment/cabang-treatment.module';
import { HappyHourModule } from './happy-hour/happy-hour.module';
import { TherapistModule } from './therapist/therapist.module';
import { AttendanceModule } from './attendance/attendance.module';
import { BannerModule } from './banner/banner.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/home/andrew/Freelance/YanShengTang/ystserver/img',
      serveRoot: '/img',
      serveStaticOptions: {},
      exclude: ['/api/*'],
      
    }),
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    NotificationModule,
    PrismaModule,
    AuthModule,
    CabangModule,
    TreatmentModule,
    CategoryModule,
    CabangTreatmentModule,
    HappyHourModule,
    TherapistModule,
    AttendanceModule,
    BannerModule,
    RatingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
