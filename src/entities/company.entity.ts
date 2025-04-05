// src/entities/company.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { CompanyUser } from './company-user.entity';
import { CompanyStock } from './company-stock.entity';
import { Franchise } from './franchise.entity';
import { StockRequest } from './stock-request.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => CompanyUser, (user) => user.company)
  users: CompanyUser[];

  @OneToMany(() => CompanyStock, (stock) => stock.company)
  stocks: CompanyStock[];

  @OneToMany(() => Franchise, (franchise) => franchise.company)
  franchises: Franchise[];

  @OneToMany(() => StockRequest, (stockRequest) => stockRequest.company)
  stockRequests: StockRequest[];
}
