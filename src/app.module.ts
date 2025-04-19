import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './modules/customer/customer.module';
import { FranchiseModule } from './modules/franchise-product/franchiseProduct.module';
import { ProductsModule } from './modules/product/products.module';
import { Products } from './entities/products.entity';
import { Franchise } from './entities/franchise.entity';
import { Company } from './entities/company.entity';
import { FranchiseStock } from './entities/franchise-stock.entity';
import { Customer } from './entities/customer.entity';
import { FranchiseManagementModule } from './modules/franchise-management/franchise-management.module';
import { StockRequestModule } from './modules/stock-request/stock-request.module';
import { StockRequest } from './entities/stock-request.entity';
import { StockRequestItem } from './entities/stock-request-item.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      password: process.env.DATABASE_PASSWORD || 'password',
      username: process.env.DATABASE_USER || 'postgres',
      entities: [
        Products,
        Franchise,
        Company,
        FranchiseStock,
        Customer,
        StockRequest,
        StockRequestItem,
      ],
      database: process.env.DATABASE_NAME || 'icebay',
      synchronize: true,
      logging: true,
    }),
    CustomerModule,
    FranchiseModule,
    ProductsModule,
    FranchiseManagementModule,
    StockRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
