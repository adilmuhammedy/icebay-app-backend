import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Franchise } from '../../entities/franchise.entity';
import { FranchiseStock } from '../../entities/franchise-stock.entity';
import { Products } from '../../entities/products.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Customer } from '../../entities/customer.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Franchise,
      FranchiseStock,
      Products,
      Order,
      OrderItem,
      Customer,
    ]),
    AuthModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
