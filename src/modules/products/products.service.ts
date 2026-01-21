import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepo: ProductsRepository) {}

  async findAll(categoryId?: number) {
    return this.productsRepo.findAll(categoryId);
  }

  async findOne(productId: number) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }
}