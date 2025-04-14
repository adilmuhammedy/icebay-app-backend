import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FranchiseStock } from '../entities/franchise-stock.entity';
import { Franchise } from '../entities/franchise.entity';
import { Products } from '../entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FranchiseService {
  constructor(
    @InjectRepository(FranchiseStock)
    private franchiseStockRepo: Repository<FranchiseStock>,
    @InjectRepository(Franchise)
    private franchiseRepo: Repository<Franchise>,
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
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
}
