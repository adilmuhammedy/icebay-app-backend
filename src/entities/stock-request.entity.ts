// src/entities/stock-request.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./company.entity";
import { Franchise } from "./franchise.entity";
import { Product } from "./product.entity";

@Entity("stock_requests")
export class StockRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  company_id: string;

  @Column()
  franchise_id: string;

  @Column()
  product_id: string;

  @Column()
  quantity_requested: number;

  @Column({ default: "pending" })
  status: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  requested_at: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at: Date;

  @ManyToOne(() => Company, (company) => company.stockRequests)
  @JoinColumn({ name: "company_id" })
  company: Company;

  @ManyToOne(() => Franchise, (franchise) => franchise.stockRequests)
  @JoinColumn({ name: "franchise_id" })
  franchise: Franchise;

  @ManyToOne(() => Product, (product) => product.stockRequests)
  @JoinColumn({ name: "product_id" })
  product: Product;
}
