import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Franchise } from 'src/entities/franchise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { Products } from 'src/entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Company } from 'src/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User, UserRole } from 'src/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Franchise)
    private readonly franchiseRepo: Repository<Franchise>,
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Company related services
  async createCompany(dto: CreateCompanyDto) {
    // First, create the company record
    const company = this.companyRepo.create({
      name: dto.name,
    });

    const savedCompany = await this.companyRepo.save(company);

    // Then create a user account for the company
    const user = this.userRepo.create({
      email: dto.email,
      password: dto.password,
      role: UserRole.COMPANY,
      company_id: savedCompany.id,
    });

    await this.userRepo.save(user);

    // Return company without sensitive information
    return {
      id: savedCompany.id,
      name: savedCompany.name,
      email: dto.email,
    };
  }

  // Franchise related services
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

    // Generate unique QR code for the franchise
    franchise.qr_code = `FR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save the franchise first to get its ID
    const savedFranchise = await this.franchiseRepo.save(franchise);

    // Generate a random password
    const tempPassword = crypto.randomBytes(6).toString('hex');

    console.log(
      `Temporary password for franchise ${savedFranchise.name}: ${tempPassword}`)

    // Create user account for the franchise
    const email = `${franchise.name.toLowerCase().replace(/\s+/g, '.')}-${franchise.registration_id}@icebay.com`;

    const franchiseUser = this.userRepo.create({
      email: email, // Generate email based on franchise name and ID
      password: tempPassword, // Will be hashed by BeforeInsert hook
      role: UserRole.FRANCHISE,
      franchise_id: savedFranchise.id,
    });

    await this.userRepo.save(franchiseUser);

    // Return franchise with the credentials (only for initial creation)
    return {
      franchise: savedFranchise,
      credentials: {
        email,
        temporaryPassword: tempPassword,
        note: 'Please save these credentials and share them securely with the franchise owner.',
      },
    };
  }

  fetchAllFranchise() {
    return this.franchiseRepo.find({ relations: ['company'] });
  }

  async fetchCompanyFranchises(companyId: string) {
    return this.franchiseRepo.find({
      where: { company_id: companyId },
      relations: ['company'],
    });
  }

  async fetchFranchise(id: string, user?: any) {
    const franchise = await this.franchiseRepo.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!franchise) {
      throw new NotFoundException('Franchise not found');
    }

    // Check if user has access to this franchise
    if (
      user &&
      user.role === UserRole.COMPANY &&
      franchise.company_id !== user.companyId
    ) {
      throw new ForbiddenException('You do not have access to this franchise');
    }

    return franchise;
  }

  async updateFranchise(id: string, dto: UpdateFranchiseDto, user?: any) {
    const franchise = await this.fetchFranchise(id);

    // Check if user has access to update this franchise
    if (
      user &&
      user.role === UserRole.COMPANY &&
      franchise.company_id !== user.companyId
    ) {
      throw new ForbiddenException(
        'You do not have access to update this franchise',
      );
    }

    Object.assign(franchise, dto);
    return this.franchiseRepo.save(franchise);
  }

  async removeFranchise(id: string, user?: any) {
    const franchise = await this.fetchFranchise(id);

    // Check if user has access to delete this franchise
    if (
      user &&
      user.role === UserRole.COMPANY &&
      franchise.company_id !== user.companyId
    ) {
      throw new ForbiddenException(
        'You do not have access to delete this franchise',
      );
    }

    return this.franchiseRepo.remove(franchise);
  }

  // Products related services
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

  async fetchCompanyProducts(companyId: string) {
    return this.productRepo.find({
      where: { company_id: companyId },
    });
  }

  async fetchOneProduct(productId: string, user?: any) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has access to this product
    if (
      user &&
      user.role === UserRole.COMPANY &&
      product.company_id !== user.companyId
    ) {
      throw new ForbiddenException('You do not have access to this product');
    }

    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto, user?: any) {
    const product = await this.fetchOneProduct(productId, user);

    const updatedProduct = await this.productRepo.preload({
      id: productId,
      ...dto,
    });

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepo.save(updatedProduct);
  }

  async removeProduct(productId: string, user?: any) {
    const product = await this.fetchOneProduct(productId, user);
    return this.productRepo.remove(product);
  }
}
