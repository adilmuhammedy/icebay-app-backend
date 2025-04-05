// src/entities/customer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 10, nullable: true })
  otp_code: string;

  @Column({ type: 'timestamp', nullable: true })
  otp_expiry: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
