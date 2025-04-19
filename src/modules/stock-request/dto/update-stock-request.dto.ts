import { ApiProperty } from '@nestjs/swagger';
export class UpdateStockRequestDto {
  @ApiProperty({
    example: 'APPROVED',
    description: 'status of the stock request',
  })
  status: string;
}
