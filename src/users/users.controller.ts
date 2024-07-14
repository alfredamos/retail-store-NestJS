/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles('Admin', 'Customer', 'Staff')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
