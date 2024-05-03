import { Test, TestingModule } from '@nestjs/testing';
import { HappyHourService } from './happy-hour.service';

describe('HappyHourService', () => {
  let service: HappyHourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HappyHourService],
    }).compile();

    service = module.get<HappyHourService>(HappyHourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
