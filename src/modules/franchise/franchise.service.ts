import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FranchiseStock } from 'src/entities/franchise-stock.entity';
import { StockRequestItem } from 'src/entities/stock-request-item.entity';
import { StockRequest } from 'src/entities/stock-request.entity';
import { Repository } from 'typeorm';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { Franchise } from 'src/entities/franchise.entity';
import { stockRequestStatuses } from 'src/global/constants/constants';
import { UserRole } from 'src/entities/user.entity';

@Injectable()
export class FranchiseService {
  constructor(
    @InjectRepository(Franchise)
    private readonly franchiseRepo: Repository<Franchise>,

    @InjectRepository(FranchiseStock)
    private franchiseStockRepo: Repository<FranchiseStock>,

    @InjectRepository(StockRequest)
    private readonly stockRequestRepo: Repository<StockRequest>,

    @InjectRepository(StockRequestItem)
    private readonly stockRequestItemRepo: Repository<StockRequestItem>,
  ) {}

  // Helper method to validate if a user has access to a franchise
  async validateFranchiseAccess(franchiseId: string, user: any): Promise<void> {
    if (!user) throw new ForbiddenException('Authentication required');

    // Admin can access all franchises
    if (user.role === UserRole.ADMIN) return;

    const franchise = await this.franchiseRepo.findOne({
      where: { id: franchiseId },
    });

    if (!franchise) {
      throw new NotFoundException('Franchise not found');
    }

    // Franchise users can only access their own franchise
    if (user.role === UserRole.FRANCHISE && user.franchiseId !== franchiseId) {
      throw new ForbiddenException('You can only access your own franchise');
    }

    // Company users can only access franchises belonging to their company
    if (
      user.role === UserRole.COMPANY &&
      franchise.company_id !== user.companyId
    ) {
      throw new ForbiddenException(
        'This franchise does not belong to your company',
      );
    }
  }

  // Add the missing getFranchiseStock method
  async getFranchiseStock(franchiseId: string) {
    const stocks = await this.franchiseStockRepo.find({
      where: { franchise_id: franchiseId },
      relations: ['products'],
    });

    return stocks.map((stock) => ({
      id: stock.id,
      product: stock.products,
      quantity: stock.stock_quantity,
      updated_at: stock.updated_at,
    }));
  }

  async updateFranchiseStock(
    franchiseId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    const existing = await this.franchiseStockRepo.findOne({
      where: { franchise_id: franchiseId, product_id: productId },
    });

    if (existing) {
      existing.stock_quantity += quantity;
      existing.updated_at = new Date();

      if (existing.stock_quantity < 0) {
        throw new BadRequestException('Stock cannot go below zero');
      }

      await this.franchiseStockRepo.save(existing);
    } else {
      if (quantity < 0) {
        throw new BadRequestException(
          'Cannot remove non-existent product from stock',
        );
      }

      const newStock = this.franchiseStockRepo.create({
        franchise_id: franchiseId,
        product_id: productId,
        stock_quantity: quantity,
        updated_at: new Date(),
      });

      await this.franchiseStockRepo.save(newStock);
    }
  }

  // Add the missing createStockRequest method
  async createStockRequest(franchiseId: string, dto: CreateStockRequestDto) {
    const franchise = await this.franchiseRepo.findOne({
      where: { id: franchiseId },
      relations: ['company'],
    });

    if (!franchise) {
      throw new NotFoundException('Franchise not found');
    }

    const stockRequest = this.stockRequestRepo.create({
      franchise_id: franchiseId,
      company_id: franchise.company_id,
      status: stockRequestStatuses.PENDING,
    });

    const savedRequest = await this.stockRequestRepo.save(stockRequest);

    // Create stock request items if they were included
    if (dto.items && dto.items.length > 0) {
      const requestItems = dto.items.map((item) =>
        this.stockRequestItemRepo.create({
          stock_request_id: savedRequest.id,
          product_id: item.productId,
          quantity: item.quantity,
        }),
      );

      await this.stockRequestItemRepo.save(requestItems);
    }

    return savedRequest;
  }

  // Add the missing findAllStockReqeust method (fixing the typo)
  async findAllStockReqeust(franchiseId: string) {
    return this.stockRequestRepo.find({
      where: { franchise_id: franchiseId },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOneStockRequest(stockRequestId: string, user: any) {
    const request = await this.stockRequestRepo.findOne({
      where: {
        id: stockRequestId,
      },
      relations: ['franchise', 'items', 'items.product'],
    });

    if (!request) throw new NotFoundException('Stock request not found');

    // Validate access based on user role
    if (
      user.role === UserRole.FRANCHISE &&
      request.franchise_id !== user.franchiseId
    ) {
      throw new ForbiddenException('You can only view your own stock requests');
    }

    if (
      user.role === UserRole.COMPANY &&
      request.company_id !== user.companyId
    ) {
      throw new ForbiddenException(
        'This stock request does not belong to your company',
      );
    }

    return request;
  }

  async updateStockRequest(
    stockRequestId: string,
    dto: UpdateStockRequestDto,
    user: any,
  ) {
    const request = await this.stockRequestRepo.findOne({
      where: { id: stockRequestId },
      relations: ['franchise'],
    });

    if (!request) throw new NotFoundException('Stock request not found');

    // Only company and admin can update stock requests
    if (
      user.role === UserRole.COMPANY &&
      request.company_id !== user.companyId
    ) {
      throw new ForbiddenException(
        'This stock request does not belong to your company',
      );
    }

    if (dto.status) {
      const normalizedStatus = dto.status.toUpperCase();
      const validStatuses = Object.values(stockRequestStatuses);
      if (!validStatuses.includes(normalizedStatus)) {
        throw new BadRequestException(`Invalid status: ${dto.status}`);
      }
      request.status = normalizedStatus;
    }
    return this.stockRequestRepo.save(request);
  }

  async removeStockRequest(stockRequestId: string, user: any) {
    const request = await this.stockRequestRepo.findOne({
      where: { id: stockRequestId },
      relations: ['franchise'],
    });

    if (!request) throw new NotFoundException('Stock request not found');

    // Validate access
    if (
      user.role === UserRole.FRANCHISE &&
      request.franchise_id !== user.franchiseId
    ) {
      throw new ForbiddenException(
        'You can only delete your own stock requests',
      );
    }

    if (
      user.role === UserRole.COMPANY &&
      request.company_id !== user.companyId
    ) {
      throw new ForbiddenException(
        'This stock request does not belong to your company',
      );
    }

    return this.stockRequestRepo.remove(request);
  }
}
