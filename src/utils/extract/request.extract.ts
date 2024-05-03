import { HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ApiException } from '../exception/api.exception';

export function extractRequest(req: Request) {
  const userId = req.user['sub'];
  const role = req.user['role'];
  return { userId, role };
}

export function checkRole(req: Request, expectedRole: Role) {
  const { role, userId } = extractRequest(req);
  if (role !== expectedRole) {
    throw new ApiException({ status: HttpStatus.FORBIDDEN, data: 'forbidden' });
  }
  return userId;
}
