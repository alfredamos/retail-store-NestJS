/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

export class CurrentUserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role?: Role;
}
