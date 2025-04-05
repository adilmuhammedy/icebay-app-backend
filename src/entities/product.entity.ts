// src/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { CompanyStock } from "./company-stock.entity";
import { FranchiseStock } from "./franchise-stock.entity";
import { StockRequest } from "./stock-request.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => CompanyStock, (stock) => stock.product)
  companyStocks: CompanyStock[];

  @OneToMany(() => FranchiseStock, (stock) => stock.product)
  franchiseStocks: FranchiseStock[];

  @OneToMany(() => StockRequest, (stockRequest) => stockRequest.product)
  stockRequests: StockRequest[];
}
