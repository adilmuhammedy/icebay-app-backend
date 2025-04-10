import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Franchise } from '../entities/franchise.entity';
import { FranchiseStock } from '../entities/franchise-stock.entity';
import { Product } from '../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Franchise, FranchiseStock, Product])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
