import { Test, TestingModule } from '@nestjs/testing';
import { ServerBannerService } from './server-banner.service';

describe('ServerBannerService', () => {
  let service: ServerBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerBannerService],
    }).compile();

    service = module.get<ServerBannerService>(ServerBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
