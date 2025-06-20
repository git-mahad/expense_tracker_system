import { IsNotEmpty, IsString } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class UpdateExpenseDto{
  @PrimaryGeneratedColumn()
  id: string
  
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsString()
  @IsNotEmpty()
  amount?: number
}