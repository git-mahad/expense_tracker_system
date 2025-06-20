import { IsNotEmpty, IsString } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class ExpenseCreateDto{
  @PrimaryGeneratedColumn()
  id: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  amount: number
}