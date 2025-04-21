import { Module } from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { FranchiseController } from './franchise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { FranchiseStock } from 'src/entities/franchise-stock.entity';
import { Franchise } from 'src/entities/franchise.entity';
import { StockRequest } from 'src/entities/stock-request.entity';
import { StockRequestItem } from 'src/entities/stock-request-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      FranchiseStock,
      Franchise,
      StockRequest,
      StockRequestItem,
    ]),
  ],
  controllers: [FranchiseController],
  providers: [FranchiseService],
})
export class FranchiseModule {}
