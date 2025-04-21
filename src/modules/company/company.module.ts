import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchise } from 'src/entities/franchise.entity';
import { Products } from 'src/entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Franchise, Products])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
