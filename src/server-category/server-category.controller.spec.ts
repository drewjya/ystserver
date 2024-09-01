import { Test, TestingModule } from '@nestjs/testing';
import { ServerCategoryController } from './server-category.controller';
import { ServerCategoryService } from './server-category.service';

describe('ServerCategoryController', () => {
  let controller: ServerCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerCategoryController],
      providers: [ServerCategoryService],
    }).compile();

    controller = module.get<ServerCategoryController>(ServerCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
