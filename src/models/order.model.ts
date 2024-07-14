/* eslint-disable prettier/prettier */
import { CartItem } from '@prisma/client';
import { User } from './userModel';

export class OrderModel {
  id: string;
  items: number;
  total: number;
  userId: string;
  cartItems: CartItem[];
  user?: User;
}
