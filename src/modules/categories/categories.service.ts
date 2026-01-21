import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepo: CategoriesRepository) {}

  async findAll() {
    return this.categoriesRepo.findAll();
  }

  async findOne(categoryId: number) {
    const category = await this.categoriesRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return category;
  }
}