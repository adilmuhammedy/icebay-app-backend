// src/entities/company-stock.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Company } from "./company.entity";
import { Product } from "./product.entity";

@Entity("company_stock")
export class CompanyStock {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  company_id: string;

  @Column()
  product_id: string;

  @Column()
  stock_quantity: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne(() => Company, (company) => company.stocks)
  @JoinColumn({ name: "company_id" })
  company: Company;

  @ManyToOne(() => Product, (product) => product.companyStocks)
  @JoinColumn({ name: "product_id" })
  product: Product;
}
