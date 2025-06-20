import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserUpdateDto{

  @IsString()
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string

}