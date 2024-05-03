import { Test, TestingModule } from '@nestjs/testing';
import { HappyHourController } from './happy-hour.controller';
import { HappyHourService } from './happy-hour.service';

describe('HappyHourController', () => {
  let controller: HappyHourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HappyHourController],
      providers: [HappyHourService],
    }).compile();

    controller = module.get<HappyHourController>(HappyHourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
