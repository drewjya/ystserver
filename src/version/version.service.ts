import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVersionDto } from './dto/create-version.dto';

@Injectable()
export class VersionService {
  constructor(private prisma: PrismaService) { }
  create(createVersionDto: CreateVersionDto) {
    return 'This action adds a new version';
  }

  findOne() {
    return this.prisma.version.findFirst();
  }


}
