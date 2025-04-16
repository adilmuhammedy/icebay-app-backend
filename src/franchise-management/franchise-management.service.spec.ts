import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseManagementService } from './franchise-management.service';

describe('FranchiseManagementService', () => {
  let service: FranchiseManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FranchiseManagementService],
    }).compile();

    service = module.get<FranchiseManagementService>(FranchiseManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
