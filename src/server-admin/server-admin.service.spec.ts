import { Test, TestingModule } from '@nestjs/testing';
import { ServerAdminService } from './server-admin.service';

describe('ServerAdminService', () => {
  let service: ServerAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerAdminService],
    }).compile();

    service = module.get<ServerAdminService>(ServerAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
