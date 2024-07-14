/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService){}
  
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: createProductDto
    });

    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    //----> Retrieve all products from db.
    const allProducts = await this.prisma.product.findMany({});
    //----> Send back the response.
    return allProducts;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({where: {id}});
    //----> Check for existence of product.
    if (!product){
      throw new NotFoundException(`The product with id : ${id} is not found!`);
    }
    //----> Send back response
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    //----> Check for the existence of product.
    this.findOne(id);
    //----> Update the product.
    const updatedProduct = await this.prisma.product.update({
      data: {...updateProductDto},
      where: {id}
    });
    //----> Send back the response.
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    //----> Check for the existence of product.
    this.findOne(id);
    //----> Delete the product.
    const deletedProduct = await this.prisma.product.delete({where: {id}});
    //----> Send back the response
    return deletedProduct
  }
}
