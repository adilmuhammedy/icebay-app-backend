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
import { Products } from './products.entity';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Franchise, (franchise) => franchise.stocks)
  @JoinColumn({ name: 'franchise_id' })
  franchise: Franchise;

  @ManyToOne(() => Products, (product) => product.franchiseStocks)
  @JoinColumn({ name: 'product_id' })
  products: Products;
}
