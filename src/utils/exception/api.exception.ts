import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(param: {
    status: HttpStatus;
    data: string | Record<string, any>;
  }) {
    super(param.data, param.status);
  }
}
