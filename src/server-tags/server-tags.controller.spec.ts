import { Test, TestingModule } from '@nestjs/testing';
import { ServerTagsController } from './server-tags.controller';
import { ServerTagsService } from './server-tags.service';

describe('ServerTagsController', () => {
  let controller: ServerTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerTagsController],
      providers: [ServerTagsService],
    }).compile();

    controller = module.get<ServerTagsController>(ServerTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
