import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CustomerService } from './customer.service';
import { SendOtpDto, SendOtpDtoResponse } from './dto/send-otp.dto';
import { VerifyOtpDto, VerifyOtpResponseDto } from './dto/verify-otp.dto';
import { FranchiseResponseDto } from './dto/franchise.dto';
import { ProductResponseDto } from './dto/product.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { AuthService } from '../auth/auth.service';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  @Public()
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

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify the OTP and authenticate the customer' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    type: VerifyOtpResponseDto,
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const verified = await this.customerService.verifyOtp(verifyOtpDto);

    if (verified.authenticated && verified.customerId) {
      // Generate JWT token for authenticated customer only if customerId exists
      const tokenData = await this.authService.generateCustomerToken(
        verifyOtpDto.phone,
        verified.customerId,
      );
      return {
        ...verified,
        access_token: tokenData.access_token,
      };
    }

    return verified;
  }

  @Public()
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

  @Public()
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

  @Roles(UserRole.CUSTOMER)
  @Post('cart')
  @ApiOperation({ summary: 'Create a new shopping cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully',
  })
  createCart(@Body() dto: CreateCartDto, @Request() req) {
    // Use customer ID from the JWT token if available
    if (req.user && req.user.sub) {
      dto.customerId = req.user.sub;
    }
    return this.customerService.createCart(dto);
  }

  @Roles(UserRole.CUSTOMER)
  @Get('cart/:orderId')
  @ApiOperation({ summary: 'Get cart details' })
  @ApiResponse({
    status: 200,
    description: 'Cart details retrieved',
  })
  getCart(@Param('orderId') orderId: string) {
    return this.customerService.getCart(orderId);
  }

  @Roles(UserRole.CUSTOMER)
  @Post('cart/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added successfully',
  })
  addItem(@Body() dto: AddItemDto) {
    return this.customerService.addItem(dto);
  }

  @Roles(UserRole.CUSTOMER)
  @Put('cart/items/:itemId')
  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
  })
  updateItem(@Param('itemId') itemId: string, @Body() dto: UpdateItemDto) {
    return this.customerService.updateItem(itemId, dto);
  }

  @Roles(UserRole.CUSTOMER)
  @Delete('cart/items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed successfully',
  })
  removeItem(@Param('itemId') itemId: string) {
    return this.customerService.removeItem(itemId);
  }

  @Roles(UserRole.CUSTOMER)
  @Post('orders/checkout')
  @ApiOperation({ summary: 'Checkout order' })
  @ApiResponse({
    status: 200,
    description: 'Order placed successfully',
  })
  async checkoutOrder(@Body('orderId') orderId: string) {
    return await this.customerService.checkoutOrder(orderId);
  }
}
