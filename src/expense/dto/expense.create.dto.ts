import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class ExpenseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 40 })
  title: string;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.expenses)
  user: User;
}