/* eslint-disable prettier/prettier */
import { Gender, Role } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: Role;
  gender: Gender;
}
