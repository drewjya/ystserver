import { Controller } from '@nestjs/common';
import { ServerCabangtherapistService } from './server-cabangtherapist.service';

@Controller('server/cabangtherapist')
export class ServerCabangtherapistController {
  constructor(private readonly service: ServerCabangtherapistService) {}
}
