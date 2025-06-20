import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity])],
  providers: [ExpenseService],
  controllers: [ExpenseController],
})
export class ExpenseModule {}
