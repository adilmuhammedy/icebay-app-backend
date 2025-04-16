import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Franchise } from '../entities/franchise.entity';
import { Repository } from 'typeorm';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';

@Injectable()
export class FranchiseManagementService {
  constructor(
    @InjectRepository(Franchise)
    private readonly repo: Repository<Franchise>,
  ) {}

  create(dto: CreateFranchiseDto) {
    const franchise = this.repo.create(dto);
    return this.repo.save(franchise);
  }

  findAll() {
    return this.repo.find({ relations: ['company'] });
  }

  async findOne(id: string) {
    const franchise = await this.repo.findOne({
      where: { id },
      relations: ['company', 'owner'],
    });
    if (!franchise) throw new NotFoundException('Franchise not found');
    return franchise;
  }

  async update(id: string, dto: UpdateFranchiseDto) {
    const franchise = await this.findOne(id);
    Object.assign(franchise, dto);
    return this.repo.save(franchise);
  }

  async remove(id: string) {
    const franchise = await this.findOne(id);
    return this.repo.remove(franchise);
  }
}
