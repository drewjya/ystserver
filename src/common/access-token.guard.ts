import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const res = http.getResponse();
    const req = http.getRequest();
    req.res = res;

    return super.canActivate(context);
  }
}