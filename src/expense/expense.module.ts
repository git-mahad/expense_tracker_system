import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [],
  controllers: [ExpenseModule]
})

export class ExpenseModule{}