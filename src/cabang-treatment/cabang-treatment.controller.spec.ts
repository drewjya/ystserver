import { Test, TestingModule } from '@nestjs/testing';
import { CabangTreatmentController } from './cabang-treatment.controller';
import { CabangTreatmentService } from './cabang-treatment.service';

describe('CabangTreatmentController', () => {
  let controller: CabangTreatmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabangTreatmentController],
      providers: [CabangTreatmentService],
    }).compile();

    controller = module.get<CabangTreatmentController>(CabangTreatmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
