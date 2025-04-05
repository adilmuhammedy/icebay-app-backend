import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './config/database.config';

async function bootstrap() {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();  // Runs migrations on startup

    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
