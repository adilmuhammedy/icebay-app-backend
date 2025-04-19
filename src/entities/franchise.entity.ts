import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Company } from './company.entity';
import { v4 as uuidv4 } from 'uuid';
import { FranchiseStock } from './franchise-stock.entity';
import { StockRequest } from './stock-request.entity';

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

  @Column({ nullable: true })
  owner_name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ type: 'text', unique: true, nullable: true })
  qr_code: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'int', unique: true, generated: 'increment' })
  registration_id: number;

  @Column({ length: 255 })
  location: string;

  @ManyToOne(() => Company, (company) => company.franchises)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => FranchiseStock, (stock) => stock.franchise)
  stocks: FranchiseStock[];

  @OneToMany(() => StockRequest, (request) => request.franchise)
  stock_requests: StockRequest[];

  // Auto-generate UUID for owner_id
  @BeforeInsert()
  generateOwnerId() {
    this.owner_id = uuidv4();
  }
}
