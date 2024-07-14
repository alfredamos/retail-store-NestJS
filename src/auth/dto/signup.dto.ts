/* eslint-disable prettier/prettier */
import { Gender, Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdminUser } from 'src/models/adminUser';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
  @IsOptional()
  @IsEnum(Role)
  role: Role;
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
  @IsOptional()
  adminUser: AdminUser;
}
