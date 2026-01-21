import { Injectable } from '@nestjs/common';
import { KnexService } from '../../database/knex.service';

@Injectable()
export class ProductsRepository {
  constructor(private knex: KnexService) {}

  async findAll(categoryId?: number) {
    const query = this.knex.knexInstance('products')
      .select(
        'products.*',
        'categories.category_name'
      )
      .leftJoin('categories', 'products.category_id', 'categories.category_id');

    if (categoryId) {
      query.where('products.category_id', categoryId);
    }

    return query;
  }

  async findById(productId: number) {
    return this.knex.knexInstance('products')
      .select(
        'products.*',
        'categories.category_name'
      )
      .leftJoin('categories', 'products.category_id', 'categories.category_id')
      .where('products.product_id', productId)
      .first();
  }

  async updateStock(productId: number, quantity: number, trx?: any) {
    const db = trx || this.knex.knexInstance;
    
    return db('products')
      .where({ product_id: productId })
      .decrement('units_in_stock', quantity);
  }

  async checkStock(productId: number, trx?: any) {
    const db = trx || this.knex.knexInstance;
    
    const product = await db('products')
      .where({ product_id: productId })
      .first();
    
    return product;
  }
}