// src/entities/company.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Franchise } from './franchise.entity';
import { StockRequest } from './stock-request.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  // @Column({ length: 255 })
  // stock_request_id: string;

  @OneToMany(() => StockRequest, (stockRequest) => stockRequest.company)
  stock_requests: StockRequest[];

  @OneToMany(() => Franchise, (franchise) => franchise.company)
  franchises: Franchise[];
}
