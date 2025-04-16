import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFranchiseDto {
  @ApiProperty({
    example: 'e7aabf42-9cd0-4c23-a732-44b21e0aab88',
    description: 'UUID of the company to which the franchise belongs',
  })
  @IsUUID()
  company_id: string;

  @ApiProperty({
    example: 'b6d24f1d-c2ee-4af5-887c-dc7aa4b298a0',
    description: 'UUID of the user who owns the franchise',
  })
  @IsUUID()
  owner_id: string;

  @ApiProperty({
    example: 'GreenMart - Kochi',
    description: 'Name of the franchise',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+91-9876543210',
    description: 'Phone number of the franchise',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: '12/456 MG Road, Ernakulam, Kerala',
    description: 'Address of the franchise',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Kochi, Kerala',
    description: 'Location where the franchise is situated',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: 'REG-KOCHI-105',
    description: 'Custom registration code if applicable',
  })
  @IsOptional()
  @IsString()
  reg_code?: string;
}
