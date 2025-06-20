import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity"; // Adjust the import path as necessary

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

  @ManyToOne(() => UserEntity, user => user.expenses)
  user: UserEntity;
}
