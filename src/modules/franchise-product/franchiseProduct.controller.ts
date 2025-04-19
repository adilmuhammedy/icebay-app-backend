import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { FranchiseService } from './franchiseProduct.service';

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
  getProducts(@Param('franchiseId') franchiseId: string) {
    return this.franchiseService.getFranchiseStock(franchiseId);
  }
}
