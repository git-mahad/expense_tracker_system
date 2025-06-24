import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ExpenseCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
