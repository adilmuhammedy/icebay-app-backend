import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Franchise } from 'src/entities/franchise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { Products } from 'src/entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Franchise)
    private readonly franchiseRepo: Repository<Franchise>,
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
  ) {}

  //franchise related services
  async createFranchise(dto: CreateFranchiseDto) {
    const franchise = this.franchiseRepo.create(dto);
    const phone = dto.phone;
    const is_present = await this.franchiseRepo.findOne({
      where: { phone },
    });
    if (is_present) {
      throw new BadRequestException(
        'Franchise with this phone number already exists',
      );
    }
    return this.franchiseRepo.save(franchise);
  }

  fetchAllFranchise() {
    return this.franchiseRepo.find({ relations: ['company'] });
  }

  async fetchFranchise(id: string) {
    const franchise = await this.franchiseRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!franchise) throw new NotFoundException('Franchise not found');
    return franchise;
  }

  async updateFranchise(id: string, dto: UpdateFranchiseDto) {
    const franchise = await this.fetchFranchise(id);
    Object.assign(franchise, dto);
    return this.franchiseRepo.save(franchise);
  }

  async removeFranchise(id: string) {
    const franchise = await this.fetchFranchise(id);
    return this.franchiseRepo.remove(franchise);
  }

  //products related services
  async createProduct(dto: CreateProductDto) {
    const existingProduct = await this.productRepo.findOne({
      where: { name: dto.name },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this name already exists');
    }
    const products = this.productRepo.create(dto);
    return this.productRepo.save(products);
  }

  async fetchAllProducts() {
    return this.productRepo.find();
  }

  async fetchOneProduct(productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    const product = await this.productRepo.preload({ id: productId, ...dto });
    if (!product) throw new NotFoundException('Product not found');
    return this.productRepo.save(product);
  }

  async removeProduct(productId: string) {
    const product = await this.fetchOneProduct(productId);
    return this.productRepo.remove(product);
  }
}
