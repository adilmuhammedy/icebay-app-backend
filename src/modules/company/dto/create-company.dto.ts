import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@acmecorp.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
