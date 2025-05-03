import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Vanilla' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Vanilla Ice popsicle' })
  description: string;

  @IsNumber()
  @ApiProperty({ example: 10 })
  price: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    description: 'Company ID that owns this product',
  })
  company_id?: string;
}
