import { Test, TestingModule } from '@nestjs/testing';
import { ServerTreatmentController } from './server-treatment.controller';
import { ServerTreatmentService } from './server-treatment.service';

describe('ServerTreatmentController', () => {
  let controller: ServerTreatmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerTreatmentController],
      providers: [ServerTreatmentService],
    }).compile();

    controller = module.get<ServerTreatmentController>(ServerTreatmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
