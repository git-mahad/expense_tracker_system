import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create_budget.dto';
import { User } from 'src/auth/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepo: Repository<Budget>,
  ) {}

  async createBudget(dto: CreateBudgetDto, user: User): Promise<Budget> {
    const budget = this.budgetRepo.create({ ...dto, user });
    return await this.budgetRepo.save(budget);
  }

  async getUserBudgets(userId: number): Promise<Budget[]> {
    return await this.budgetRepo.find({ where: { user: { id: userId } } });
  }

  async getBudgetReport(userId: number): Promise<any> {
    const budgets = await this.getUserBudgets(userId);
    return budgets.map((b) => ({
      month: b.month,
      amount: b.amount,
    }));
  }

  async exportBudgetsToCSV(userId: number): Promise<string> {
    const budgets = await this.getUserBudgets(userId);
    const csv = budgets.map((b) => `${b.month},${b.amount}`).join('\n');
    const filePath = path.join(
      __dirname,
      `../../../exports/user-${userId}-budgets.csv`,
    );
    fs.writeFileSync(filePath, csv);
    return filePath;
  }

  async importBudgetsFromCSV(csvData: string, user: User): Promise<Budget[]> {
    const lines = csvData.trim().split('\n');
    const budgets: Budget[] = [];

    for (const line of lines) {
      const [month, amount] = line.split(',');
      const budget = this.budgetRepo.create({
        month,
        amount: parseFloat(amount),
        user,
      });
      budgets.push(await this.budgetRepo.save(budget));
    }

    return budgets;
  }
}
