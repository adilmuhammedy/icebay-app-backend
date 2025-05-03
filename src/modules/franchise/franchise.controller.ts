import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FranchiseService } from './franchise.service';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Franchise')
@ApiBearerAuth()
@Controller('franchise')
@Roles(UserRole.FRANCHISE, UserRole.ADMIN, UserRole.COMPANY)
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Post(':franchiseId/products')
  @ApiOperation({ summary: 'Add products to franchise stock' })
  @ApiResponse({ status: 201, description: 'Product added successfully' })
  @Roles(UserRole.FRANCHISE, UserRole.COMPANY, UserRole.ADMIN)
  async addProductToFranchise(
    @Param('franchiseId') franchiseId: string,
    @Body() { productId, quantity }: { productId: string; quantity: number },
    @Request() req,
  ) {
    // Validate user has access to this franchise
    await this.franchiseService.validateFranchiseAccess(franchiseId, req.user);

    return this.franchiseService.updateFranchiseStock(
      franchiseId,
      productId,
      quantity,
    );
  }

  @Delete(':franchiseId/products')
  @ApiOperation({ summary: 'Remove products from franchise stock' })
  @ApiResponse({ status: 200, description: 'Product removed successfully' })
  @Roles(UserRole.FRANCHISE, UserRole.COMPANY, UserRole.ADMIN)
  async removeProductFromFranchise(
    @Param('franchiseId') franchiseId: string,
    @Body() { productId, quantity }: { productId: string; quantity: number },
    @Request() req,
  ) {
    // Validate user has access to this franchise
    await this.franchiseService.validateFranchiseAccess(franchiseId, req.user);

    return this.franchiseService.updateFranchiseStock(
      franchiseId,
      productId,
      -quantity,
    );
  }

  @Get(':franchiseId/products')
  @ApiOperation({ summary: 'Get franchise stock' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @Roles(UserRole.FRANCHISE, UserRole.COMPANY, UserRole.ADMIN)
  async getProducts(@Param('franchiseId') franchiseId: string, @Request() req) {
    // Validate user has access to this franchise
    await this.franchiseService.validateFranchiseAccess(franchiseId, req.user);

    return this.franchiseService.getFranchiseStock(franchiseId);
  }

  @Post(':franchiseId/stock-requests')
  @ApiOperation({ summary: 'Create a stock request' })
  @ApiResponse({
    status: 201,
    description: 'Stock request created successfully',
  })
  @Roles(UserRole.FRANCHISE)
  async createStockRequest(
    @Param('franchiseId') franchiseId: string,
    @Body() dto: CreateStockRequestDto,
    @Request() req,
  ) {
    // Ensure franchise users can only create requests for their own franchise
    if (
      req.user.role === UserRole.FRANCHISE &&
      req.user.franchiseId !== franchiseId
    ) {
      throw new ForbiddenException(
        'You can only create stock requests for your own franchise',
      );
    }

    return this.franchiseService.createStockRequest(franchiseId, dto);
  }

  @Get(':franchiseId/stock-requests')
  @ApiOperation({ summary: 'Get all stock requests for a franchise' })
  @ApiResponse({
    status: 200,
    description: 'Stock requests retrieved successfully',
  })
  @Roles(UserRole.FRANCHISE, UserRole.COMPANY, UserRole.ADMIN)
  async findAllStockRequest(
    @Param('franchiseId') franchiseId: string,
    @Request() req,
  ) {
    // Validate user has access to this franchise
    await this.franchiseService.validateFranchiseAccess(franchiseId, req.user);

    return this.franchiseService.findAllStockReqeust(franchiseId);
  }

  @Get('stock-requests/:stockRequestId')
  @ApiOperation({ summary: 'Get a specific stock request' })
  @ApiResponse({
    status: 200,
    description: 'Stock request retrieved successfully',
  })
  @Roles(UserRole.FRANCHISE, UserRole.COMPANY, UserRole.ADMIN)
  async findOneStockRequest(
    @Param('stockRequestId') stockRequestId: string,
    @Request() req,
  ) {
    return this.franchiseService.findOneStockRequest(stockRequestId, req.user);
  }

  @Put('stock-requests/:stockRequestId')
  @ApiOperation({ summary: 'Update a stock request' })
  @ApiResponse({
    status: 200,
    description: 'Stock request updated successfully',
  })
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
  async updateStockRequest(
    @Param('stockRequestId') stockRequestId: string,
    @Body() dto: UpdateStockRequestDto,
    @Request() req,
  ) {
    return this.franchiseService.updateStockRequest(
      stockRequestId,
      dto,
      req.user,
    );
  }

  @Delete('stock-requests/:stockRequestId')
  @ApiOperation({ summary: 'Delete a stock request' })
  @ApiResponse({
    status: 200,
    description: 'Stock request deleted successfully',
  })
  @Roles(UserRole.FRANCHISE, UserRole.COMPANY, UserRole.ADMIN)
  async removeStockRequest(
    @Param('stockRequestId') stockRequestId: string,
    @Request() req,
  ) {
    return this.franchiseService.removeStockRequest(stockRequestId, req.user);
  }
}
