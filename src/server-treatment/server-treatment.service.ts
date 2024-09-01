import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServerTreatmentService {
    constructor (private prisma: PrismaService){}
    async findTreatmentList(){


    }
}
