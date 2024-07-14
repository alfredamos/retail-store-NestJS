/* eslint-disable prettier/prettier */
import { Role } from "@prisma/client";

export class AuthUser{
  id: string;
  name: string;
  role: Role;
  token: string;

}