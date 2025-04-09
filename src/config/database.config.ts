import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST') as string,
    port: configService.get('DATABASE_PORT') as number,
    username: configService.get('DATABASE_USER') as string,
    password: configService.get('DATABASE_PASSWORD') as string,
    database: configService.get('DATABASE_NAME') as string,
    autoLoadEntities: true,
    synchronize: true, // Set to false in prod
  }),
  inject: [ConfigService],
};
