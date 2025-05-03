import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { stockRequestStatuses } from '../../../global/constants/constants';

export class UpdateStockRequestDto {
  @ApiProperty({
    example: 'approved',
    enum: Object.values(stockRequestStatuses),
    description: 'New status for the stock request',
  })
  @IsString()
  @IsEnum(stockRequestStatuses)
  @IsOptional()
  status?: string;
}
