import { Test, TestingModule } from '@nestjs/testing';
import { ServerTherapistController } from './server-therapist.controller';
import { ServerTherapistService } from './server-therapist.service';

describe('ServerTherapistController', () => {
  let controller: ServerTherapistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerTherapistController],
      providers: [ServerTherapistService],
    }).compile();

    controller = module.get<ServerTherapistController>(ServerTherapistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
