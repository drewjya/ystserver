import { Test, TestingModule } from '@nestjs/testing';
import { ServerTherapistService } from './server-therapist.service';

describe('ServerTherapistService', () => {
  let service: ServerTherapistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerTherapistService],
    }).compile();

    service = module.get<ServerTherapistService>(ServerTherapistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
