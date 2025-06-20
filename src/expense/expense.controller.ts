import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseCreateDto } from './dto/expense.create.dto';
import { UpdateExpenseDto } from './dto/expense.update.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/entities/user.entity';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // ========================================
  // ✅ USER ROUTES
  // ========================================

  @Post()
  async createExpense(@Body() dto: ExpenseCreateDto, @Request() req) {
    return this.expenseService.createExpense(dto, req.user);
  }

  @Get()
  async getUserExpenses(@Request() req) {
    return this.expenseService.getUserExpenses(req.user.id);
  }

  @Get(':id')
  async getExpenseById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.expenseService.getExpenseById(id, req.user.id);
  }

  @Put(':id')
  async updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expenseService.updateExpense(id, dto, req.user.id);
  }

  @Delete(':id')
  async deleteExpense(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.expenseService.deleteExpense(id, req.user.id);
  }

  // ========================================
  // ADMIN ROUTES
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)

  @Get('admin/all')
  async getAllExpenses(@Request() req) {
    return this.expenseService.getAllExpenses(req.user);
  }

  @Get('admin/user/:userId')
  async getExpensesByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ) {
    return this.expenseService.getExpensesByUserId(req.user, userId);
  }

  @Put('admin/:id')
  async updateAnyExpense(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expenseService.updateAnyExpense(req.user, id, dto);
  }

  @Delete('admin/:id')
  async deleteAnyExpense(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.expenseService.deleteAnyExpense(req.user, id);
  }

  @Get('admin/stats/total')
  async getTotalExpensesPerUser(@Request() req) {
    return this.expenseService.totalExpensesPerUser(req.user);
  }

  @Get('admin/stats/monthly')
  async getMonthlySummaries(@Request() req) {
    return this.expenseService.monthlySummaries(req.user);
  }
}