import { Test, TestingModule } from '@nestjs/testing';
import { CabangTreatmentService } from './cabang-treatment.service';

describe('CabangTreatmentService', () => {
  let service: CabangTreatmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CabangTreatmentService],
    }).compile();

    service = module.get<CabangTreatmentService>(CabangTreatmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
