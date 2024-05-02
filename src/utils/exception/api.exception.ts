import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(status: HttpStatus, data: string | Record<string, any>) {
    super(data, status);
  }
}
