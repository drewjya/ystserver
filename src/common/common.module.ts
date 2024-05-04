import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderQuery } from './query/order.query';
import { TherapistQuery } from './query/therapist.query';
import { UserQuery } from './query/user.query';

@Module({
  providers: [OrderQuery, TherapistQuery, UserQuery],
  exports: [OrderQuery, TherapistQuery, UserQuery],
  imports: [PrismaModule],
})
export class CommonModule {}
