import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':productId')
  findOne(@Param('productId') productId: string) {
    return this.productService.findOne(productId);
  }

  @Put(':productId')
  update(@Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(productId, dto);
  }

  @Delete(':productId')
  remove(@Param('productId') productId: string) {
    return this.productService.remove(productId);
  }
}
