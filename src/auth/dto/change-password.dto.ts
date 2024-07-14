/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  @IsNotEmpty()
  @IsString()
  newPassword: string;
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
