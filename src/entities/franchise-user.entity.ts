// src/entities/franchise-user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Franchise } from "./franchise.entity";

@Entity("franchise_users")
export class FranchiseUser {
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
  franchise_id: string;

  @ManyToOne(() => Franchise, (franchise) => franchise.users)
  @JoinColumn({ name: "franchise_id" })
  franchise: Franchise;
}
