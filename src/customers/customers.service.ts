/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService){}
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    //----> Destructure userId from payload.
    const {userId} =createCustomerDto;
    //----> Check for the user-id.
    const user = await this.prisma.user.findUnique({where: {id: userId}});
    if (!user){
      throw new NotFoundException("Invalid user!");
    }
    //----> Create a new customer.
    const customer = await this.prisma.customer.create({ data: {...createCustomerDto}});
    //----> Send back the response.
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    //----> Retrieve all customers.
    const allCustomers = await this.prisma.customer.findMany({});
    //----> Send back the response.
    return allCustomers;
  }

  async findOne(id: string): Promise<Customer> {
    //----> Retrieve the customer with the given id.
    const customer = await this.prisma.customer.findUnique({where: {id}});
    //----> Check for the existence of customer with the given id.
    if(!customer){
      throw new NotFoundException(`The customer with id : ${id} is not found!`);
    }
    //----> Send back the response.
    return customer;
  }

  async findOneByUserId(userId: string): Promise<Customer> {
    //----> Retrieve the customer with the given id.
    const customer = await this.prisma.customer.findUnique({where: {userId}});
    //----> Check for the existence of customer with the given id.
    if(!customer){
      throw new NotFoundException(`The customer with userId : ${userId} is not found!`);
    }
    //----> Send back the response.
    return customer;
  }
  
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    //----> Check for the existence of customer.
    this.findOne(id);
    //----> Check for valid user-id.
    const {userId} = updateCustomerDto;
    const user = await this.prisma.user.findUnique({where: {id : userId} });
    if (!user){
      throw new NotFoundException("Invalid user");
    }
    //----> Update the customer with the given id.
    const updatedCustomer = await this.prisma.customer.update({data: {...updateCustomerDto}, where: {id}});
    //----> Send back the response.
    return updatedCustomer;
  }

  async remove(id: string): Promise<Customer> {
    //----> Check for the existence of customer with the given id.
    await this.findOne(id);
    //----> Delete the customer with the the given id.
    const deletedCustomer = await this.prisma.customer.delete({
      where: { id },
    });
    //----> Delete the attached user before deleting the customer.
    await this.prisma.user.delete({ where: { id: deletedCustomer?.userId } });
    //----> Send back the response.
    return deletedCustomer;
  }
}
