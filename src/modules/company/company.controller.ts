import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('franchise')
  createFranchise(@Body() dto: CreateFranchiseDto) {
    return this.companyService.createFranchise(dto);
  }

  @Get('franchise')
  fetchAllFranchise() {
    return this.companyService.fetchAllFranchise();
  }

  @Get('franchise/:franchiseId')
  fetchOneFranchise(@Param('franchiseId') id: string) {
    return this.companyService.fetchFranchise(id);
  }

  @Put('franchise/:franchiseId')
  updateFranchiseDetails(
    @Param('franchiseId') id: string,
    @Body() dto: UpdateFranchiseDto,
  ) {
    return this.companyService.updateFranchise(id, dto);
  }

  @Delete('franchise/:franchiseId')
  removeFranchise(@Param('franchiseId') id: string) {
    return this.companyService.removeFranchise(id);
  }

  @Post('product')
  create(@Body() dto: CreateProductDto) {
    return this.companyService.createProduct(dto);
  }

  @Get('product')
  fetchAllProducts() {
    return this.companyService.fetchAllProducts();
  }

  @Get('product/:productId')
  fetchOneProduct(@Param('productId') productId: string) {
    return this.companyService.fetchOneProduct(productId);
  }

  @Put('product/:productId')
  updateProduct(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.companyService.updateProduct(productId, dto);
  }

  @Delete('product/:productId')
  remove(@Param('productId') productId: string) {
    return this.companyService.removeProduct(productId);
  }
}
