import { Test, TestingModule } from '@nestjs/testing';
import { CabangController } from './cabang.controller';
import { CabangService } from './cabang.service';

describe('CabangController', () => {
  let controller: CabangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabangController],
      providers: [CabangService],
    }).compile();

    controller = module.get<CabangController>(CabangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
