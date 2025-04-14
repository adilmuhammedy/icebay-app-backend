import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppDataSource } from './data-source'; // <-- add this

async function bootstrap() {
  await AppDataSource.initialize(); // <-- initialize the connection
  await AppDataSource.runMigrations(); // <-- run pending migrations
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('IceBay API')
    .setDescription('Icebay Stock Management and franchise management app API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
