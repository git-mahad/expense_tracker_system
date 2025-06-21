import { IsString } from 'class-validator';

export class ImportBudgetDto {
  @IsString()
  fileContent: string;
}
