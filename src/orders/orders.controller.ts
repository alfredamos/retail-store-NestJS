/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('Admin', 'Customer')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Roles('Admin', 'Customer')
  @Delete('delete-all-orders-by-customer-id/:customerId')
  deleteAllOrdersByCustomerId(@Param('customerId') customerId: string) {
    return this.ordersService.removeOrdersByCustomerId(customerId);
  }

  @Roles('Admin', 'Customer', 'Staff')
  @Delete('delete-all-orders-by-user-id/:userId')
  deleteAllOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.removeOrdersByUserId(userId);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles('Admin')
  @Get('orders-by-customer-id/:customerId')
  findAllByCustomerId(@Param('customerId') customerId: string) {
    return this.ordersService.findAllByCustomerId(customerId);
  }

  @Roles('Admin', 'Customer', 'Staff')
  @Get('orders-by-user-id/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.ordersService.findAllByUserId(userId);
  }

  @Roles('Admin', 'Customer', 'Staff')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles('Admin')
  @Patch('delivered/:orderId')
  orderDelivered(@Param('orderId') orderId: string) {
    return this.ordersService.orderDelivered(orderId);
  }

  @Roles('Admin')
  @Patch('shipped/:orderId')
  orderShipped(@Param('orderId') orderId: string) {
    return this.ordersService.orderShipped(orderId);
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles('Admin', 'Customer')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.removeOne(id);
  }
}
