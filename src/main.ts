import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const db = app.get(DatabaseService);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', // En producción usa la URL real
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  try {
    const result = await db.sqlQuery('SELECT 1 FROM SYSIBM.SYSDUMMY1');
    console.log('CONEXION EXITOSA:', result);
  } catch (error) {
    console.error('ERROR DE CONEXION:', error);
  }

  await app.listen(3000);
}
bootstrap();
