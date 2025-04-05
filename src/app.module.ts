import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { databaseConfig } from "./config/database.config";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRootAsync(databaseConfig)],
})
export class AppModule {}
