/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem, Order, Status } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { cartItems: carts, ...rest } = createOrderDto;
    const cartItems = carts as CartItem[];

    //----> Get the total quantity and total price into order.
    console.log('Before modifier');
    const modifiedOrder = this.adjustTotalPriceAndTotalQuantity(
      rest as Order,
      cartItems,
    );
    console.log('After modifier');
    console.log({ modifiedOrder, cartItems });
    //----> Store the new order info in the database.
    const createdOrder = await this.prisma.order.create({
      data: {
        ...modifiedOrder,
        orderDate: new Date(),
        cartItems: {
          create: [...(cartItems as CartItem[])],
        },
      },
      include: {
        cartItems: true,
      },
    });

    return createdOrder;
  }

  async findAll() {
    //----> Get all the orders from the database.
    const allOrders = await this.prisma.order.findMany({
      include: { cartItems: true, customer: true },
    });

    //----> Send back the response.
    return allOrders;
  }

  async findAllByCustomerId(customerId: string) {
    //----> Get all the orders from the database.
    const allOrders = await this.prisma.order.findMany({
      where: { customerId },
      include: {
        cartItems: true,
        customer: true,
      },
    });
    //----> Send back the response.
    return allOrders;
  }

  async findAllByUserId(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException(`Invalid user-id : ${userId}`);
    }
    //----> Get all the orders from the database.
    const allOrders = await this.prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        cartItems: true,
        customer: true,
      },
    });
    //----> Send back the response.
    return allOrders;
  }

  async findOne(id: string) {
    //----> Check for the existence of order in the db.
    const order = await this.getOrderById(id, true);
    //----> Send back the response.
    return order;
  }

  async orderDelivered(orderId: string) {
    console.log('Order delivered!!!');
    //----> Get the order.
    const order = await this.getOrderById(orderId);

    if (!order.isShipped) {
      throw new BadRequestException(
        'Order must be shipped before delivery, please ship the order!',
      );
    }
    //----> Update the order delivery info.
    const deliveredOrder = this.deliveryInfo(order);
    //----> Update the order delivery info in the database.
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...deliveredOrder,
      },
    });
    //----> Send back the response
    return updatedOrder;
  }

  async orderShipped(orderId: string) {
    console.log('Order shipped!!!');
    //----> Get the order.
    const order = await this.getOrderById(orderId);
    //----> Update the shipping information.
    const shippedOrder = this.shippingInfo(order);
    console.log({ shippedOrder });
    //----> Update the order in the database.
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...shippedOrder,
      },
    });
    //----> Send back the response
    return updatedOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    //----> Check for the existence of order in the db.
    await this.getOrderById(id);
    //----> Get the orderToEdit from the request body.
    //----> Store the edited order info in the database.
    const editedOrder = await this.prisma.order.update({
      where: { id },
      data: { ...(updateOrderDto as Order) },
    });
    //----> Send back the response.
    return editedOrder;
  }

  async removeOne(id: string) {
    //----> Check for the existence of order in the database.
    await this.getOrderById(id);
    //----> Delete all associated cart-items.
    await this.prisma.order.update({
      where: { id },
      data: {
        cartItems: {
          deleteMany: {},
        },
      },
      include: {
        cartItems: true,
      },
    });
    //----> Delete the order info from the database.
    const deletedOrder = await this.prisma.order.delete({ where: { id } });
    //----> Send back the response.
    return deletedOrder;
  }

  async removeOrdersByCustomerId(customerId: string) {
    console.log("I'm in delete all orders by customerId", { customerId });
    //----> Get all the orders by customerId.
    const orders = await this.prisma.order.findMany({ where: { customerId } });
    //----> Delete all these others in the database.
    this.allOrdersDeletedByCustomerId(orders, customerId);
    //----> Send back the response.    
    return {
      message:
        'All Orders associated with this customer have been deleted successfully!',
    };
  }

  async removeOrdersByUserId(userId: string) {
    console.log("I'm in delete all orders by customerId", { userId });

    //----> Get the customer with the user-id.
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Get all the orders by customerId.
    const orders = await this.prisma.order.findMany({
      where: { customerId: customer?.id },
    });
    //----> Delete all these others in the database.
    this.allOrdersDeletedByCustomerId(orders, customer?.id);
    //----> Send back the response.
   
    return {
      message:
        'All Orders associated with this customer have been deleted successfully!',
    };
  }

  private async getOrderById(id: string, include: boolean = false) {
    //----> Retrieve the order info with this id from database.
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id },
      include: {
        cartItems: include,
        customer: include,
      },
    });
    //----> Send back a valid order.
    return order;
  }

  private shippingInfo(order: Order) {
    //----> Update the order shipping info.
    order.isShipped = true; //----> Order shipped.
    order.shippingDate = new Date(); //----> Order shipping date.
    order.status = Status.Shipped; //----> Order status.

    //----> Return the updated order.
    return order;
  }

  private deliveryInfo(order: Order) {
    //----> Update the order delivery info.
    order.isDelivered = true; //----> Order shipped.
    order.deliveryDate = new Date(); //----> Order shipping date.
    order.status = Status.Delivered; //----> Order status.
    //----> Return the updated order
    return order;
  }

  private findCartItem(cartItems: CartItem[], cartItemId: string): CartItem {
    return cartItems?.find((cartItem) => cartItem.id === cartItemId);
  }

  private cartItemFilter(
    cartItems: CartItem[],
    cartItemId: string,
  ): CartItem[] {
    return cartItems?.filter((carItem) => carItem.id !== cartItemId);
  }

  private adjustTotalPriceAndTotalQuantity(
    order: Order,
    cartItems: CartItem[] = [],
  ): Order {
    console.log({ order, cartItems });
    //----> Calculate both the total cost and total quantity.
    const totalQuantity = cartItems?.reduce(
      (acc, current) => acc + current.quantity,
      0,
    );
    const totalPrice = cartItems?.reduce(
      (acc, current) => acc + current.price * current.quantity,
      0,
    );
    //----> Adjust the total cost and total quantity on the order.
    order.totalPrice = totalPrice;
    order.totalQuantity = totalQuantity;
    //----> Return the modified order.
    return order;
  }

  private cartItemsModInput(cartItems: CartItem[]) {
    return cartItems?.map(({ id, name, price, quantity, productId }) => {
      return { id, name, price, quantity, productId };
    });
  }

  private updateAllCartItems(cartItems: CartItem[], orderId: string) {
    //----> Edit all cart-items at once.
    const editedAllCarItems = cartItems.map(async (cart) => {
      return await this.prisma.cartItem.update({
        where: { id: cart.id, orderId },
        data: { ...cart },
      });
    });

    //----> Collect all edited cart-items in Promise.all().
    const updatedCartItems = Promise.all(editedAllCarItems);

    //----> Return the updated cart-items.

    return updatedCartItems;
  }

  private allOrdersDeletedByCustomerId(orders: Order[], customerId: string) {
    //----> Delete all orders by customerId
    const customerOrders = orders?.filter(
      (order) => order.customerId === customerId,
    );
    customerOrders?.forEach(async (order) => {
      //----> Delete all associated cart-items.
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          cartItems: {
            deleteMany: {},
          },
        },
        include: {
          cartItems: true,
        },
      });
      //----> Delete the order info from the database.
      await this.prisma.order.delete({ where: { id: order.id } });
    });
  }
}
