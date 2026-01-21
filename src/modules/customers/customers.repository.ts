import { Injectable } from '@nestjs/common';
import { KnexService } from '../../database/knex.service';

@Injectable()
export class CustomersRepository {
  constructor(private knex: KnexService) {}

  async findAll() {
    return this.knex.knexInstance('customers').select('*');
  }

  async findById(customerId: number) {
    return this.knex.knexInstance('customers')
      .where({ customer_id: customerId })
      .first();
  }

  async findByEmail(email: string) {
    return this.knex.knexInstance('customers')
      .where({ email })
      .first();
  }

  async update(customerId: number, data: any) {
    const [updated] = await this.knex.knexInstance('customers')
      .where({ customer_id: customerId })
      .update({
        ...data,
        updated_at: this.knex.knexInstance.fn.now(),
      })
      .returning('*');
    return updated;
  }

  async delete(customerId: number) {
    return this.knex.knexInstance('customers')
      .where({ customer_id: customerId })
      .delete();
  }
}