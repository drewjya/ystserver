import { Test, TestingModule } from '@nestjs/testing';
import { ServerCategoryService } from './server-category.service';

describe('ServerCategoryService', () => {
  let service: ServerCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerCategoryService],
    }).compile();

    service = module.get<ServerCategoryService>(ServerCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
