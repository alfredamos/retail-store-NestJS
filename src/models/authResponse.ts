/* eslint-disable prettier/prettier */

import { UserResponse } from "./userResponse";

export class AuthResponse { 
  user: UserResponse;
  signIn?: UserResponse;
  token: string;
  isLoggedIn: boolean;
  isAdmin?: boolean
}