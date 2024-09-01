import { Test, TestingModule } from '@nestjs/testing';
import { ServerCabangService } from './server-cabang.service';

describe('ServerCabangService', () => {
  let service: ServerCabangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerCabangService],
    }).compile();

    service = module.get<ServerCabangService>(ServerCabangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
