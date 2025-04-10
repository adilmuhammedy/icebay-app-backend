// src/entities/franchise-stock.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Franchise } from './franchise.entity';
import { Product } from './product.entity';

@Entity('franchise_stock')
export class FranchiseStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  franchise_id: string;

  @Column()
  product_id: string;

  @Column()
  stock_quantity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Franchise, (franchise) => franchise.stocks)
  @JoinColumn({ name: 'franchise_id' })
  franchise: Franchise;

  @ManyToOne(() => Product, (product) => product.franchiseStocks)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
