/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

export class UserInfo {
  id: string;
  name: string;
  role: Role;
  isLoggedIn?: boolean;
  token?: string;
  message?: string;
}
