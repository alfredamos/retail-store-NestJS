/* eslint-disable prettier/prettier */
import { CartItem } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  customerId: string;
  @IsOptional()
  cartItems: CartItem[]
}
