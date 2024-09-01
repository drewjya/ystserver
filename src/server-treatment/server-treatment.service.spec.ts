import { Test, TestingModule } from '@nestjs/testing';
import { ServerTreatmentService } from './server-treatment.service';

describe('ServerTreatmentService', () => {
  let service: ServerTreatmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerTreatmentService],
    }).compile();

    service = module.get<ServerTreatmentService>(ServerTreatmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
