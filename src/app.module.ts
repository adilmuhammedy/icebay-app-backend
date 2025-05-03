import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './modules/customer/customer.module';
import { Products } from './entities/products.entity';
import { Franchise } from './entities/franchise.entity';
import { Company } from './entities/company.entity';
import { FranchiseStock } from './entities/franchise-stock.entity';
import { Customer } from './entities/customer.entity';
import { StockRequest } from './entities/stock-request.entity';
import { StockRequestItem } from './entities/stock-request-item.entity';
import { CompanyModule } from './modules/company/company.module';
import { FranchiseModule } from './modules/franchise/franchise.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
        User,
      ],
      database: process.env.DATABASE_NAME || 'icebay',
      synchronize: true,
      logging: true,
    }),
    CustomerModule,
    CompanyModule,
    FranchiseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log('APP_GUARD providers registered');
  }
}
