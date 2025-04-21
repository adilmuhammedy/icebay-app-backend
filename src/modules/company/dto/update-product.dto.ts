import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from '../../company/dto/create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'Updated Product Name' })
  name?: string;

  @ApiProperty({ example: 'Updated product description.' })
  description?: string;

  @ApiProperty({ example: 99.99 })
  price?: number;
}
