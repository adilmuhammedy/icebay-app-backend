import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class StockRequestItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateStockRequestDto {
  @ApiProperty({
    type: [StockRequestItemDto],
    description: 'Items to request',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockRequestItemDto)
  items: StockRequestItemDto[];
}
