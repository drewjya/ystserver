import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError) // 1
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  // 2
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message); // 3
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        const status = HttpStatus.CONFLICT;
        const key = exception.meta.target[0];

        let error = {};
        error[key] = 'unique';
        const errorResponse = {
          data: null,
          message: 'invalid_request',
          status: status,
          error: error,
        };

        response.json(errorResponse).status(status);
        break;

      default:
        super.catch(exception, host);

        break;
    }
  }
}
