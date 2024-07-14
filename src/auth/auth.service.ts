/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserInfo } from 'src/models/userInfoModel';
import { Role } from '@prisma/client';
import { RoleChangeDto } from './dto/role-change.dto';
import { CurrentUserDto } from 'src/users/dto/current-user.dto';
import { AuthResponse } from 'src/models/authResponse';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, newPassword, oldPassword, confirmPassword } =
      changePasswordDto;

    //----> Check for match between newPassword and confirmPassword.
    if (newPassword.normalize() !== confirmPassword.normalize()) {
      throw new BadRequestException('Passwords must match!');
    }

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Retrieve the old password.
    const oldHashedPassword = user.password;

    //----> Check for the correctness of password.
    const isValid = await bcrypt.compare(oldPassword, oldHashedPassword);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Hash the new password.
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    //----> Insert the new password in the database.
    const updatedUserDetail = await this.prisma.user.update({
      where: { email },
      data: { ...user, password: newHashedPassword },
    });

    //----> Get new token.
    const token = this.jwt.sign({
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
    });

    //----> User info.
    const userInfo: UserInfo = {
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
      token,
      message: 'Password has been successfully updated!',
    };

    return userInfo;
  }

  async editProfile(editProfileDto: EditProfileDto) {
    const { email, password } = editProfileDto;
    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Retrieve the password in the database.
    const hashedPassword = user.password;

    //----> Check for the correctness of password.
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Store the change in the database.
    const updatedUserDetail = await this.prisma.user.update({
      where: { email },
      data: { ...editProfileDto, id: user.id, password: hashedPassword },
    });

    //----> Get new token.
    const token = this.jwt.sign({
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
    });

    //----> User info.
    const userInfo: UserInfo = {
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
      token,
      message: 'User info has been successfully updated!',
    };

    return userInfo;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Retrieve the password in the database.
    const hashedPassword = user.password;

    //----> Check for the correctness of password.
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Get new token.
    const token = this.jwt.sign({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    delete user.password;

    //----> User info.
    const authResponse: AuthResponse = {
      user,
      token,
      isLoggedIn: true,
      isAdmin: user?.role === Role.Admin,
    };

    return authResponse;
  }

  async signup(signupDto: SignupDto) {
    const { email, password, confirmPassword, adminUser, ...rest } = signupDto;

    //----> password and confirmPassword must match.
    if (password.normalize() !== confirmPassword.normalize()) {
      throw new BadRequestException('Password must match confirm password!');
    }

    delete signupDto.confirmPassword;

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (user) {
      throw new BadRequestException('User already exists!');
    }

    //----> Hash the new password.
    const hashedPassword = await bcrypt.hash(password, 12);

    //----> Store the new user in the database.
    const newUser = await this.prisma.user.create({
      data: { ...rest, password: hashedPassword, email },
    });

    //----> Get new token.
    const token = this.jwt.sign({
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    });

    //----> User info.
    delete newUser?.password;

    const isAdmin = adminUser?.role === Role.Admin;

    const authResponse: AuthResponse = {
      user: isAdmin ? adminUser : newUser,
      signIn: newUser,
      token: isAdmin ? adminUser?.token : token,
      isLoggedIn: true,
      isAdmin: isAdmin ? true : false,
    };

    return authResponse;
  }

  async updateUserRole(roleChangeDto: RoleChangeDto, user: CurrentUserDto) {
    //----> Extract the role of the current user from the user object.
    const adminRole = user?.role;    
    //----> Check for admin rights.
    if (adminRole !== Role.Admin) {
      throw new ForbiddenException(
        'You are not permitted to perform the task!',
      );
    }

    //----> Destructure for role and email.
    const { email, role } = roleChangeDto;

    //----> Extract the details of the user to with role to be updated.
    const userToHaveNewRole = await this.prisma.user.findUnique({
      where: { email },
    });

    //----> Check for the existence of user.
    if (!userToHaveNewRole) {
      throw new NotFoundException(
        `The user with email : ${email} is not found in the database!`,
      );
    }

    //----> Update the user new role in the database.
    const userRoleUpdated = await this.prisma.user.update({
      where: { email },
      data: { ...userToHaveNewRole, role },
    });

    //----> Send back the response.
    return userRoleUpdated;
  }
}
