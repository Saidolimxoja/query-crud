import { Injectable } from '@nestjs/common';
import { KnexService } from '../../database/knex.service';

@Injectable()
export class OrdersRepository {
  constructor(private knex: KnexService) {}

  async findAllByCustomer(customerId: number) {
    return this.knex.knexInstance('orders')
      .where({ customer_id: customerId })
      .orderBy('order_date', 'desc');
  }

  async findById(orderId: number) {
    return this.knex.knexInstance('orders')
      .where({ order_id: orderId })
      .first();
  }

  async findOrderDetails(orderId: number) {
    return this.knex.knexInstance('order_details')
      .select(
        'order_details.*',
        'products.product_name'
      )
      .leftJoin('products', 'order_details.product_id', 'products.product_id')
      .where({ order_id: orderId });
  }

  async createOrder(customerId: number, orderData: any, trx: any) {
    const [order] = await trx('orders')
      .insert({
        customer_id: customerId,
        freight: orderData.freight || 0,
        ship_name: orderData.ship_name,
        ship_address: orderData.ship_address,
        ship_city: orderData.ship_city,
        ship_country: orderData.ship_country,
      })
      .returning('*');

    return order;
  }

  async createOrderDetail(orderDetail: any, trx: any) {
    const [detail] = await trx('order_details')
      .insert(orderDetail)
      .returning('*');

    return detail;
  }
}
