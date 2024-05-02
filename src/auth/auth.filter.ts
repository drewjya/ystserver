import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ApiException } from 'src/utils/exception/api.exception';

@Catch(ApiException)
export class AuthFilter extends BaseExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost) {
    console.error(exception.message); // 3
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    let error = {};
    const resp = exception.getResponse();
    let message = 'invalid_request';
    if (typeof resp === 'string' || resp instanceof String) {
      error['@root'] = resp;
      message = `${resp}`;
    } else {
      error = resp;
    }

    const errorResponse = {
      status: status,
      error: error,
      message: message,
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
