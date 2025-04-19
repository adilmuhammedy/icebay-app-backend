// src/entities/stock-request-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockRequest } from './stock-request.entity';
import { Products } from './products.entity'; // assuming stock items are products

@Entity('stock_request_items')
export class StockRequestItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  products: Products;

  @Column('int')
  quantity: number;

  @Column()
  stock_request_id: string;

  @ManyToOne(() => StockRequest, (request) => request.stock_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_request_id' })
  stock_requests: StockRequest;
}
