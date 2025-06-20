import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class UserCreateDto{
  @PrimaryGeneratedColumn()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

}