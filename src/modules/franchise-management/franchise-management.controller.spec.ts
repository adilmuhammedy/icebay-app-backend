import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseManagementController } from './franchise-management.controller';
import { FranchiseManagementService } from './franchise-management.service';

describe('FranchiseManagementController', () => {
  let controller: FranchiseManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FranchiseManagementController],
      providers: [FranchiseManagementService],
    }).compile();

    controller = module.get<FranchiseManagementController>(FranchiseManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
