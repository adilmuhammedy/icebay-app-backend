// src/entities/stock-request.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { StockRequestItem } from './stock-request-item.entity';
import { Franchise } from './franchise.entity';

@Entity('stock_requests')
export class StockRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, (company) => company.stock_requests)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  franchise_id: string;

  @ManyToOne(() => Franchise, (franchise) => franchise.stock_requests)
  @JoinColumn({ name: 'franchise_id' })
  franchise: Franchise;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => StockRequestItem, (item) => item.stock_requests, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  stock_items: StockRequestItem[];
}
