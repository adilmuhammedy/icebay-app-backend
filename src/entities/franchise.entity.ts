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
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './company.entity';
import { FranchiseStock } from './franchise-stock.entity';

@Entity('franchises')
export class Franchise {
  @ApiProperty({ example: '9a7b1e3f-9dd9-4a29-b3b3-cf5f9a0fabb7' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'e7aabf42-9cd0-4c23-a732-44b21e0aab88' })
  @Column()
  company_id: string;

  @ApiProperty({ example: 'GreenMart - Kochi' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 'b6d24f1d-c2ee-4af5-887c-dc7aa4b298a0' })
  @Column()
  owner_id: string;

  @ApiProperty({ example: '12/456 MG Road, Ernakulam, Kerala' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ example: '+91-9876543210' })
  @Column({ length: 20, unique: true })
  phone: string;

  @ApiProperty({ example: 'https://yourdomain.com/qr/franchise-001' })
  @Column({ type: 'text', unique: true, nullable: true })
  qr_code: string;

  @ApiProperty({ example: '2025-04-16T10:30:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ example: 10523 })
  @Column({ nullable: true })
  registration_id: number;

  @ApiProperty({ example: 'Kochi, Kerala' })
  @Column({ length: 255 })
  location: string;

  @ManyToOne(() => Company, (company) => company.franchises)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => FranchiseStock, (stock) => stock.franchise)
  stocks: FranchiseStock[];
}
