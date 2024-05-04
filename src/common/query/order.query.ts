import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderQuery {
  constructor(private prisma: PrismaService) {}
}

