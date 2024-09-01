import { Test, TestingModule } from '@nestjs/testing';
import { ServerOrderService } from './server-order.service';

describe('ServerOrderService', () => {
  let service: ServerOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerOrderService],
    }).compile();

    service = module.get<ServerOrderService>(ServerOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
