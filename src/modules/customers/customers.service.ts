import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private customersRepo: CustomersRepository) {}

  async findAll() {
    return this.customersRepo.findAll();
  }

  async findOne(customerId: number) {
    const customer = await this.customersRepo.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
    // Удаляем password_hash из ответа
    const { password_hash, ...result } = customer;
    return result;
  }

  async update(customerId: number, updateDto: UpdateCustomerDto) {
    const customer = await this.customersRepo.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const updated = await this.customersRepo.update(customerId, updateDto);
    const { password_hash, ...result } = updated;
    return result;
  }

  async remove(customerId: number) {
    const customer = await this.customersRepo.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    await this.customersRepo.delete(customerId);
    return { message: 'Customer deleted successfully' };
  }
}