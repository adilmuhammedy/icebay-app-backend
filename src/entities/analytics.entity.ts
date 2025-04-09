// src/entities/analytics.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entity_id: string;

  @Column()
  entity_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_sales: number;

  @Column()
  total_orders: number;

  @Column({ nullable: true })
  top_selling_product: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_updated',
  })
  last_updated: Date;
}
