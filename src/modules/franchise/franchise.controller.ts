import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';

@Controller('franchise')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Post(':franchiseId/products')
  async addProductToFranchise(
    @Param('franchiseId') franchiseId: string,
    @Body() { productId, quantity }: { productId: string; quantity: number },
  ) {
    return this.franchiseService.updateFranchiseStock(
      franchiseId,
      productId,
      quantity,
    );
  }

  @Delete(':franchiseId/products')
  async removeProductFromFranchise(
    @Param('franchiseId') franchiseId: string,
    @Body() { productId, quantity }: { productId: string; quantity: number },
  ) {
    return this.franchiseService.updateFranchiseStock(
      franchiseId,
      productId,
      -quantity,
    );
  }

  @Get(':franchiseId/products')
  async getProducts(@Param('franchiseId') franchiseId: string) {
    return this.franchiseService.getFranchiseStock(franchiseId);
  }

  @Post(':franchiseId')
  createStockRequest(
    @Param('franchiseId') franchiseId: string,
    @Body() dto: CreateStockRequestDto,
  ) {
    return this.franchiseService.createStockRequest(franchiseId, dto);
  }

  @Get(':franchiseId')
  findAllStockRequest(@Param('franchiseId') franchiseId: string) {
    return this.franchiseService.findAllStockReqeust(franchiseId);
  }

  @Get(':stockRequestId')
  findOneStockRequest(@Param('stockRequestId') stockRequestId: string) {
    return this.franchiseService.findOneStockRequest(stockRequestId);
  }

  @Put(':stockRequestId')
  updateStockRequest(
    @Param('stockRequestId') stockRequestId: string,
    @Body() dto: UpdateStockRequestDto,
  ) {
    return this.franchiseService.updateStockRequest(stockRequestId, dto);
  }

  @Delete(':stockRequestId')
  removeStockRequest(@Param('stockRequestId') stockRequestId: string) {
    return this.franchiseService.removeStockRequest(stockRequestId);
  }
}
