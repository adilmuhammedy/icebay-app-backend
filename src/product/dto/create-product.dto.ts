import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
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
  @ApiProperty({ example: '10' })
  price: number;
}
