import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Franchise } from '../entities/franchise.entity';
import { FranchiseStock } from '../entities/franchise-stock.entity';
import { Products } from '../entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Franchise,
      FranchiseStock,
      Products,
      Order,
      OrderItem,
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
