import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Franchise } from '../../entities/franchise.entity';
import { Products } from '../../entities/products.entity';
import { Company } from '../../entities/company.entity';
import { User } from '../../entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Franchise, Products, Company, User]),
    AuthModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
