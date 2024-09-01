import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServerTherapistService {
    constructor (private prisma: PrismaService){}
    async findTherapistList(){}
}
