import { Test, TestingModule } from '@nestjs/testing';
import { ServerTagsService } from './server-tags.service';

describe('ServerTagsService', () => {
  let service: ServerTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerTagsService],
    }).compile();

    service = module.get<ServerTagsService>(ServerTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
