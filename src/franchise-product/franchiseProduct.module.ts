import { Module } from '@nestjs/common';
import { FranchiseService } from './franchiseProduct.service';
import { FranchiseController } from './franchiseProduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { FranchiseStock } from '../entities/franchise-stock.entity';
import { Franchise } from '../entities/franchise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, FranchiseStock, Franchise])],
  controllers: [FranchiseController],
  providers: [FranchiseService],
})
export class FranchiseModule {}
