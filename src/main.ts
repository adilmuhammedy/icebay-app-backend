import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppDataSource } from './data-source';

async function bootstrap() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  const app = await NestFactory.create(AppModule);

  // Configure Swagger with bearer authentication
  const config = new DocumentBuilder()
    .setTitle('IceBay API')
    .setDescription('Icebay Stock Management and franchise management app API')
    .setVersion('1.0')
    .addBearerAuth() // Simplified version - this should work better
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Enable CORS if needed
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
