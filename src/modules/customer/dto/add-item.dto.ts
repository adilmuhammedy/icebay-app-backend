import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  franchiseId: string;
}
