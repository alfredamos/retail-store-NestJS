/* eslint-disable prettier/prettier */
import { Role, Gender } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
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
  role?: Role;
  @IsOptional()
  gender?: Gender;
}
