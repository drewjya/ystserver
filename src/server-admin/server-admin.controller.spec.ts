import { Test, TestingModule } from '@nestjs/testing';
import { ServerAdminController } from './server-admin.controller';
import { ServerAdminService } from './server-admin.service';

describe('ServerAdminController', () => {
  let controller: ServerAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerAdminController],
      providers: [ServerAdminService],
    }).compile();

    controller = module.get<ServerAdminController>(ServerAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
