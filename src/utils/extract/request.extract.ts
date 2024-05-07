import { HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ApiException } from '../exception/api.exception';

export function extractRequest(req: Request) {
  const userId = req.user['sub'];
  const role = req.user['role'];
  return { userId, role };
}

export function checkRole(req: Request, expectedRole: Role | Role[]) {
  const { role, userId } = extractRequest(req);

  if (expectedRole instanceof Array) {
    if (!expectedRole.includes(role)) {
      throw new ApiException({
        status: HttpStatus.FORBIDDEN,
        data: 'forbidden',
      });
    }
    return userId;
  }
  if (role !== expectedRole) {
    throw new ApiException({ status: HttpStatus.FORBIDDEN, data: 'forbidden' });
  }
  return userId;
}
