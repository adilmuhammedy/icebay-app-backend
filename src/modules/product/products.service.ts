import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../../entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const existingProduct = await this.productRepo.findOne({
      where: { name: dto.name },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this name already exists');
    }
    const products = this.productRepo.create(dto);
    return this.productRepo.save(products);
  }

  async findAll() {
    return this.productRepo.find();
  }

  async findOne(productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(productId: string, dto: UpdateProductDto) {
    const product = await this.productRepo.preload({ id: productId, ...dto });
    if (!product) throw new NotFoundException('Product not found');
    return this.productRepo.save(product);
  }

  async remove(productId: string) {
    const product = await this.findOne(productId);
    return this.productRepo.remove(product);
  }
}
