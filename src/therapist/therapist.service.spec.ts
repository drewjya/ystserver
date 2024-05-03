import { Test, TestingModule } from '@nestjs/testing';
import { TherapistService } from './therapist.service';

describe('TherapistService', () => {
  let service: TherapistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TherapistService],
    }).compile();

    service = module.get<TherapistService>(TherapistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
