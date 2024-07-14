/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  street: string;
  @IsNotEmpty()
  @IsString()
  city: string;
  @IsNotEmpty()
  @IsString()
  state: string;
  @IsNotEmpty()
  @IsString()
  postCode: string;
  @IsNotEmpty()
  @IsString()
  country: string;
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
