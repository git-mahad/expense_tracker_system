import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseModule])],
  providers: [],
  controllers: [],
})

export class ExpenseModule{}