import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  async updateFranchiseStock(
    franchiseId: string,
    productId: string,
    quantity: number, // positive for add, negative for remove
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

  async getFranchiseStock(franchiseId: string) {
    return this.franchiseStockRepo.find({
      where: { franchise: { id: franchiseId } },
      relations: ['product'],
    });
  }

  async createStockRequest(
    franchiseId: string,
    dto: CreateStockRequestDto,
  ): Promise<any> {
    const franchise = await this.franchiseRepo.findOne({
      where: { id: franchiseId },
    });

    if (!franchise) throw new NotFoundException('Franchise not found');

    const stockRequest = this.stockRequestRepo.create({
      franchise_id: franchise.id,
      company_id: franchise.company_id,
      stock_items: dto.stock_items.map((item) =>
        this.stockRequestItemRepo.create({
          product_id: item.product_id,
          quantity: item.quantity,
        }),
      ),
    });

    return this.stockRequestRepo.save(stockRequest);
  }

  async findAllStockReqeust(franchiseId: string) {
    const franchise = await this.franchiseRepo.findOne({
      where: { id: franchiseId },
    });

    if (!franchise) throw new NotFoundException('Franchise not found');
    return this.stockRequestRepo.find({
      where: { franchise_id: franchiseId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneStockRequest(stockRequestId: string) {
    const request = await this.stockRequestRepo.findOne({
      where: {
        id: stockRequestId,
      },
    });

    if (!request) throw new NotFoundException('Stock request not found');

    return request;
  }

  async updateStockRequest(stockRequestId: string, dto: UpdateStockRequestDto) {
    const request = await this.stockRequestRepo.findOne({
      where: { id: stockRequestId },
    });

    if (!request) throw new NotFoundException('Stock request not found');

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

  async removeStockRequest(stockRequestId: string) {
    const request = await this.stockRequestRepo.findOne({
      where: { id: stockRequestId },
    });
    if (!request) throw new NotFoundException('Stock request not found');

    return this.stockRequestRepo.remove(request);
  }
}
