/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  brand: string;
  @IsOptional()
  @IsString()
  image: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
