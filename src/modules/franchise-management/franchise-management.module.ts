import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FranchiseManagementService } from './franchise-management.service';
import { FranchiseManagementController } from './franchise-management.controller';
import { Franchise } from '../../entities/franchise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Franchise])],
  controllers: [FranchiseManagementController],
  providers: [FranchiseManagementService],
})
export class FranchiseManagementModule {}
