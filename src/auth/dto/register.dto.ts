import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, { message: 'length must be > 3' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
