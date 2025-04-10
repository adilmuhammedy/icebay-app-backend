// src/entities/franchise.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { FranchiseStock } from './franchise-stock.entity';

@Entity('franchises')
export class Franchise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  owner_id: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ type: 'text', unique: true })
  qr_code: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  registration_id: number;

  @Column({ length: 255 })
  location: string;

  @ManyToOne(() => Company, (company) => company.franchises)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => FranchiseStock, (stock) => stock.franchise)
  stocks: FranchiseStock[];
}
