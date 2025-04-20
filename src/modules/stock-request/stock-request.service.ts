import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockRequest } from 'src/entities/stock-request.entity';
import { Franchise } from 'src/entities/franchise.entity';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { StockRequestItem } from 'src/entities/stock-request-item.entity';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { stockRequestStatuses } from 'src/global/constants/constants';

@Injectable()
export class StockRequestService {
  constructor(
    @InjectRepository(StockRequest)
    private readonly stockRequestRepo: Repository<StockRequest>,

    @InjectRepository(StockRequestItem)
    private readonly stockRequestItemRepo: Repository<StockRequestItem>,

    @InjectRepository(Franchise)
    private readonly franchiseRepo: Repository<Franchise>,
  ) {}

  async create(franchiseId: string, dto: CreateStockRequestDto): Promise<any> {
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

  async findAll(franchiseId: string) {
    const franchise = await this.franchiseRepo.findOne({
      where: { id: franchiseId },
    });

    if (!franchise) throw new NotFoundException('Franchise not found');
    return this.stockRequestRepo.find({
      where: { franchise_id: franchiseId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(stockRequestId: string) {
    const request = await this.stockRequestRepo.findOne({
      where: {
        id: stockRequestId,
      },
    });

    if (!request) throw new NotFoundException('Stock request not found');

    return request;
  }

  async update(stockRequestId: string, dto: UpdateStockRequestDto) {
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

  async remove(stockRequestId: string) {
    const request = await this.stockRequestRepo.findOne({
      where: { id: stockRequestId },
    });
    if (!request) throw new NotFoundException('Stock request not found');

    return this.stockRequestRepo.remove(request);
  }
}
