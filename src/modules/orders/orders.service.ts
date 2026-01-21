import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { KnexService } from '../../database/knex.service';
import { OrdersRepository } from './orders.repository';
import { ProductsRepository } from '../products/products.repository';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private knex: KnexService,
    private ordersRepo: OrdersRepository,
    private productsRepo: ProductsRepository,
  ) {}

  async findAll(customerId: number) {
    return this.ordersRepo.findAllByCustomer(customerId);
  }

  async findOne(orderId: number, customerId: number) {
    const order = await this.ordersRepo.findById(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.customer_id !== customerId) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderDetails = await this.ordersRepo.findOrderDetails(orderId);

    return {
      ...order,
      items: orderDetails,
    };
  }

  async create(customerId: number, createOrderDto: CreateOrderDto) {
    const trx = await this.knex.knexInstance.transaction();

    try {
      let totalAmount = 0;

      // 1. Проверяем наличие всех товаров
      for (const item of createOrderDto.items) {
        const product = await this.productsRepo.checkStock(item.product_id, trx);

        if (!product) {
          throw new BadRequestException(`Product with ID ${item.product_id} not found`);
        }

        if (product.units_in_stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product "${product.product_name}". Available: ${product.units_in_stock}, requested: ${item.quantity}`
          );
        }

        const subtotal = product.unit_price * item.quantity * (1 - (item.discount || 0));
        totalAmount += subtotal;
      }

      // 2. Создаём заказ
      const order = await this.ordersRepo.createOrder(
        customerId,
        createOrderDto,
        trx
      );

      // 3. Создаём order_details и уменьшаем stock
      for (const item of createOrderDto.items) {
        const product = await this.productsRepo.checkStock(item.product_id, trx);

        const subtotal = product.unit_price * item.quantity * (1 - (item.discount || 0));

        await this.ordersRepo.createOrderDetail(
          {
            order_id: order.order_id,
            product_id: item.product_id,
            unit_price: product.unit_price,
            quantity: item.quantity,
            discount: item.discount || 0,
          },
          trx
        );

        // Уменьшаем stock
        await this.productsRepo.updateStock(item.product_id, item.quantity, trx);
      }

      await trx.commit();

      // Возвращаем полный заказ с деталями
      return this.findOne(order.order_id, customerId);

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}