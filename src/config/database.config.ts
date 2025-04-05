import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const databaseConfig = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService
  ): Promise<TypeOrmModuleOptions> => ({
    type: "postgres",
    host: configService.get<string>("DATABASE_HOST"),
    port: configService.get<number>("DATABASE_PORT"),
    username: configService.get<string>("DATABASE_USER"),
    password: configService.get<string>("DATABASE_PASSWORD"),
    database: configService.get<string>("DATABASE_NAME"),
    autoLoadEntities: true,
    synchronize: true, // Set false in production
  }),
  inject: [ConfigService],
};
