import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from 'src/common/access-token.strategy';
import { RefreshTokenStrategy } from 'src/common/refresh-token.strategy';
import { NotificationModule } from 'src/notification/notification.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
    PrismaModule,
    NotificationModule,
    PassportModule,
    JwtModule.register({}),
  ],
})
export class AuthModule {}
