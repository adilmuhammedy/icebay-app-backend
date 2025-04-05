// src/entities/company-user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Company } from "./company.entity";

@Entity("company_users")
export class CompanyUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column()
  password_hash: string;

  @Column()
  role: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: "company_id" })
  company: Company;
}
