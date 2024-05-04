import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { RefreshTokenGuard } from 'src/common/refresh-token.guard';
import { uuid } from 'src/common/uuid';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  EditProfileDtO,
  FirebaseTokenDto,
  ForgetPasswordDto,
  LoginDto,
  RegisterDto,
} from './request/auth.json';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.authService.refreshToken({
      userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('confirm/:otp')
  async confirmAccount(@Req() req: Request, @Param('otp') otp: string) {
    const userId = req.user['sub'];
    return this.authService.confirmAccount({ userId, otp });
  }

  @UseGuards(AccessTokenGuard)
  @Post('token')
  async firebaseToken(@Req() req: Request, @Body() token: FirebaseTokenDto) {
    const userId = req.user['sub'];
    return this.authService.setFirebaseToken({ userId, token: token.token });
  }

  @UseGuards(AccessTokenGuard)
  @Put('profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'img',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.');
          const val = uuid();
          cb(null, `${val}.${ext[ext.length - 1]}`);
        },
      }),
    }),
  )
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: EditProfileDtO,
  ) {
    const userId = req.user['sub'];
    return this.authService.editProfile({
      ...body,
      userId: userId,
      file: file,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Put('change-password')
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const userId = req.user['sub'];
    return this.authService.changePassword({ userId, ...body });
  }

  @Post('request-forget-password/:email')
  async requestChangePassword(
    @Req() req: Request,
    @Param('email') email: string,
  ) {
    return this.authService.requestPassword({ email });
  }

  @Post('forget-password')
  async forgetPassword(@Req() req: Request, @Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword({ ...body });
  }
}
