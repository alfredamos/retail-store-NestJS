/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    //----> Retrieve all users.
    const allUsers = await this.prisma.user.findMany({});
    //----> Send back the response.
    return allUsers;
  }

  async findOne(id: string): Promise<User> {
    //----> Retrieve the user with the given id.
    const user = await this.prisma.user.findUnique({ where: { id } });
    //----> Check for the existence of user with the given id.
    if (!user) {
      throw new NotFoundException(`The user with id : ${id} is not found!`);
    }
    //----> Send back the response.
    return user;
  }

  async remove(id: string): Promise<User> {
    //----> Check for the existence of user with the given id.
    const user = await this.findOne(id);
    await this.prisma.customer.delete({ where: { userId: user?.id } })
     
    //----> Delete the user with the given id.
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    //----> Send back the response.
    return deletedUser;
  }
}
