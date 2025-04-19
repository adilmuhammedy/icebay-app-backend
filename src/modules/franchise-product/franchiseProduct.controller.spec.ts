import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseController } from './franchiseProduct.controller';
import { FranchiseService } from './franchiseProduct.service';

describe('FranchiseController', () => {
  let controller: FranchiseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FranchiseController],
      providers: [FranchiseService],
    }).compile();

    controller = module.get<FranchiseController>(FranchiseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
