// src/entities/franchise-stock.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Franchise } from './franchise.entity';
import { Product } from './product.entity';
import { OrderItem } from './order-item.entity';

@Entity('franchise_stock')
export class FranchiseStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  franchise_id: string;

  @Column()
  product_id: string;

  @Column()
  stock_quantity: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_updated',
  })
  last_updated: Date;

  @ManyToOne(() => Franchise, (franchise) => franchise.stocks)
  @JoinColumn({ name: 'franchise_id' })
  franchise: Franchise;

  @ManyToOne(() => Product, (product) => product.franchiseStocks)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.franchiseStock)
  orderItems: OrderItem[];
}
