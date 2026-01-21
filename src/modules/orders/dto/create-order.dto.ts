import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  discount?: number;
}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  ship_name?: string;

  @IsOptional()
  @IsString()
  ship_address?: string;

  @IsOptional()
  @IsString()
  ship_city?: string;

  @IsOptional()
  @IsString()
  ship_country?: string;

  @IsOptional()
  @IsNumber()
  freight?: number;
}