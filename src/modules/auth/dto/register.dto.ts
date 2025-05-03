import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.COMPANY })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  company_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  franchise_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  customer_id?: string;
}
