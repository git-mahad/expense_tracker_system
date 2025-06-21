import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  month: string;
}
