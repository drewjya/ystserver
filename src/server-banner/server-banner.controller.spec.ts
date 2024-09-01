import { Test, TestingModule } from '@nestjs/testing';
import { ServerBannerController } from './server-banner.controller';
import { ServerBannerService } from './server-banner.service';

describe('ServerBannerController', () => {
  let controller: ServerBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerBannerController],
      providers: [ServerBannerService],
    }).compile();

    controller = module.get<ServerBannerController>(ServerBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
