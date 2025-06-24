import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseCreateDto } from './dto/expense.create.dto';
import { UpdateExpenseDto } from './dto/expense.update.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';

export interface UserExpenseSummary {
  userId: number;
  total: number;
}

export interface MonthlyExpenseSummary {
  month: string;
  total: number;
}

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expenseRepository: Repository<ExpenseEntity>,
  ) {}

// user methods

  async createExpense(
    dto: ExpenseCreateDto,
    user: User,
  ): Promise<ExpenseEntity> {
    const expense = this.expenseRepository.create({
      ...dto,
      user,
    });
    return await this.expenseRepository.save(expense);
  }

  async getUserExpenses(userId: number): Promise<ExpenseEntity[]> {
    return await this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getExpenseById(id: number, userId: number): Promise<ExpenseEntity> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async updateExpense(
    id: number,
    dto: UpdateExpenseDto,
    userId: number,
  ): Promise<ExpenseEntity> {
    const expense = await this.getExpenseById(id, userId);
    Object.assign(expense, dto);
    return await this.expenseRepository.save(expense);
  }

  async deleteExpense(
    id: number,
    userId: number,
  ): Promise<{ message: string }> {
    const expense = await this.getExpenseById(id, userId);
    await this.expenseRepository.remove(expense);
    return { message: 'Expense deleted successfully' };
  }

  // ==================================
  // ADMIN METHODS
  // =====================================

  private isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  }

  async getAllExpenses(admin: User): Promise<ExpenseEntity[]> {
    if (!this.isAdmin(admin)) {
      throw new ForbiddenException('Access denied');
    }

    return await this.expenseRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExpensesByUserId(
    admin: User,
    userId: number,
  ): Promise<ExpenseEntity[]> {
    if (!this.isAdmin(admin)) {
      throw new ForbiddenException('Access denied');
    }

    return await this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateAnyExpense(
    admin: User,
    id: number,
    dto: UpdateExpenseDto,
  ): Promise<ExpenseEntity> {
    if (!this.isAdmin(admin)) {
      throw new ForbiddenException('Access denied');
    }

    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');

    Object.assign(expense, dto);
    return await this.expenseRepository.save(expense);
  }

  async deleteAnyExpense(
    admin: User,
    id: number,
  ): Promise<{ message: string }> {
    if (!this.isAdmin(admin)) {
      throw new ForbiddenException('Access denied');
    }

    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');

    await this.expenseRepository.remove(expense);
    return { message: 'Expense deleted successfully' };
  }

  async totalExpensesPerUser(admin: User): Promise<UserExpenseSummary[]> {
    if (!this.isAdmin(admin)) {
      throw new ForbiddenException('Access denied');
    }

    const raw = await this.expenseRepository.query(`
      SELECT "userId", SUM(amount) AS total
      FROM expense_entity
      GROUP BY "userId"
    `) as UserExpenseSummary[]

    return raw;
  }

  async monthlySummaries(admin: User): Promise<MonthlyExpenseSummary[]> {
    if (!this.isAdmin(admin)) {
      throw new ForbiddenException('Access denied');
    }

    const raw = await this.expenseRepository.query(`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, SUM(amount) AS total
      FROM expense_entity
      GROUP BY month
      ORDER BY month DESC
    `) as MonthlyExpenseSummary[];

    return raw;
  }
}
