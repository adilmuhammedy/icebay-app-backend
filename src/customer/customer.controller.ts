import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { CustomerService } from './customer.service';
import { SendOtpDto, SendOtpDtoResponse } from './dto/send-otp.dto';
import { VerifyOtpDto, VerifyOtpResponseDto } from './dto/verify-otp.dto';
import { FranchiseResponseDto } from './dto/franchise.dto';
import { ProductResponseDto } from './dto/product.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('login')
  @ApiOperation({ summary: 'Send OTP to customer phone' })
  @ApiResponse({
    status: 201,
    description: 'OTP sent successfully',
    type: SendOtpDtoResponse,
  })
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.customerService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify the OTP and authenticate the customer' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    type: VerifyOtpResponseDto,
  })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.customerService.verifyOtp(verifyOtpDto);
  }

  @Get('franchises/:qrCode')
  @ApiOperation({ summary: 'Get franchise details by QR code' })
  @ApiParam({
    name: 'qrCode',
    type: String,
    description: 'QR Code of the franchise',
  })
  @ApiResponse({
    status: 200,
    description: 'Franchise details loaded',
    type: FranchiseResponseDto,
  })
  getFranchiseByQr(@Param('qrCode') qrCode: string) {
    return this.customerService.getFranchiseByQrCode(qrCode);
  }

  @Get('franchises/:franchiseId/products')
  @ApiOperation({ summary: 'Get products available at a specific franchise' })
  @ApiParam({ name: 'franchiseId', type: String, description: 'Franchise ID' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [ProductResponseDto],
  })
  getProductsByFranchise(@Param('franchiseId') franchiseId: string) {
    return this.customerService.getProductsByFranchise(franchiseId);
  }
}
