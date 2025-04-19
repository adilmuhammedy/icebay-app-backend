import { Module } from '@nestjs/common';
import { StockRequestService } from './stock-request.service';
import { StockRequestController } from './stock-request.controller';
import { StockRequest } from 'src/entities/stock-request.entity';
import { StockRequestItem } from 'src/entities/stock-request-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchise } from 'src/entities/franchise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockRequest, StockRequestItem, Franchise]),
  ],
  controllers: [StockRequestController],
  providers: [StockRequestService],
})
export class StockRequestModule {}
