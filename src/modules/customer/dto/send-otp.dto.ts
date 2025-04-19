import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+919876543210' })
  phone: string;
}

export class SendOtpDtoResponse {
  @ApiProperty({ example: 'OTP sent successfully' })
  message: string;
}
