import { ApiProperty } from '@nestjs/swagger';

export class CreateStockRequestDto {
  @ApiProperty({
    example: [
      { product_id: 'uuid-product-1', quantity: 10 },
      { product_id: 'uuid-product-2', quantity: 5 },
    ],
  })
  stock_items: {
    product_id: string;
    quantity: number;
  }[];
}
