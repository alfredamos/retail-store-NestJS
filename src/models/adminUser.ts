import { Role } from "@prisma/client";

export class AdminUser {
  id: string;
  name!: string;
  email!: string;
  gender!: string;
  phone!: string;
  role!: Role;
  token?: string;
}
