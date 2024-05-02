import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthFilter } from './auth/auth.filter';
import { PrismaClientExceptionFilter } from './prisma/prisma.filter';
import {
  Response,
  TransformInterceptor,
} from './transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
      exceptionFactory: (errors) => {
        let obj = {};
        for (const key of errors) {
          obj[key.property] = key.constraints[Object.keys(key.constraints)[0]];
        }
        const res: Response<any> = {
          data: null,
          message: 'invalid_request',
          status: HttpStatus.BAD_REQUEST,
          error: obj,
        };
        throw new HttpException(res, 400);
      },
      stopAtFirstError: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter.getInstance()));
  app.useGlobalFilters(new AuthFilter(httpAdapter.getInstance()));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}

bootstrap();
