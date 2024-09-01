import { Test, TestingModule } from '@nestjs/testing';
import { ServerCabangController } from './server-cabang.controller';
import { ServerCabangService } from './server-cabang.service';

describe('ServerCabangController', () => {
  let controller: ServerCabangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerCabangController],
      providers: [ServerCabangService],
    }).compile();

    controller = module.get<ServerCabangController>(ServerCabangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
