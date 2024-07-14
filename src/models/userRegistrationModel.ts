/* eslint-disable prettier/prettier */
import { Role } from "@prisma/client";
import { AdminUser } from "./adminUser";

export class UserRegistrationModel {
  name!: string;
  email!: string;
  phone!: string;
  password!: string;
  role!: Role;
  confirmPassword!: string;
  adminUser?: AdminUser
}
