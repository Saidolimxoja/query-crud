import { Injectable } from '@nestjs/common';
import { KnexService } from '../../database/knex.service';

@Injectable()
export class CategoriesRepository {
  constructor(private knex: KnexService) {}

  async findAll() {
    return this.knex.knexInstance('categories').select('*');
  }

  async findById(categoryId: number) {
    return this.knex.knexInstance('categories')
      .where({ category_id: categoryId })
      .first();
  }

  async create(data: any) {
    const [category] = await this.knex.knexInstance('categories')
      .insert(data)
      .returning('*');
    return category;
  }

  async update(categoryId: number, data: any) {
    const [updated] = await this.knex.knexInstance('categories')
      .where({ category_id: categoryId })
      .update({
        ...data,
        updated_at: this.knex.knexInstance.fn.now(),
      })
      .returning('*');
    return updated;
  }

  async delete(categoryId: number) {
    return this.knex.knexInstance('categories')
      .where({ category_id: categoryId })
      .delete();
  }
}