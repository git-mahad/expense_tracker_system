import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create_budget.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/entities/user.entity';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@Body() dto: CreateBudgetDto, @Request() req) {
    return this.budgetService.createBudget(dto, req.user);
  }

  @Get()
  async getUserBudgets(@Request() req) {
    return this.budgetService.getUserBudgets(req.user.id);
  }

  @Get('report')
  async report(@Request() req) {
    return this.budgetService.getBudgetReport(req.user.id);
  }

  @Get('export') // not working 
  async export(@Request() req) {
    return this.budgetService.exportBudgetsToCSV(req.user.id);
  }

  @Post('import') // not working 
  async import(@Body() body: { csv: string }, @Request() req) {
    return this.budgetService.importBudgetsFromCSV(body.csv, req.user);
  }

  // ============================
  // ADMIN ROUTES
  // ============================
 
  @Get('admin/all') // not working
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAll() {
    return this.budgetService.getAllBudgets();
  }

  @Get('admin/user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getByUser(@Param('userId') userId: string) {
    return this.budgetService.getUserBudgets(+userId);
  }
}
