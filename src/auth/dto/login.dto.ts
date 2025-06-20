import { IsEmail, IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class LoginDto{

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string 

  @IsBoolean()
  isActive: boolean;
}