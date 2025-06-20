import { ExpenseEntity } from "src/expense/entities/expense.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 3 })
  name: string;

  @Column()
  password: string;

  @OneToMany(() => ExpenseEntity, expense => expense.user)
  expenses: ExpenseEntity[];
}
