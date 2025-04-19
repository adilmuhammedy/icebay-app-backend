import { Test, TestingModule } from '@nestjs/testing';
import { StockRequestController } from './stock-request.controller';
import { StockRequestService } from './stock-request.service';

describe('StockRequestController', () => {
  let controller: StockRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockRequestController],
      providers: [StockRequestService],
    }).compile();

    controller = module.get<StockRequestController>(StockRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
