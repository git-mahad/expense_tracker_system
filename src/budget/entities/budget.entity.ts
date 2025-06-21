import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column()
  month: string; 

  @ManyToOne(() => User, user => user.budgets)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
