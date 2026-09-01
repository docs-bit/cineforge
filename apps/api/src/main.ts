import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: process.env.NODE_ENV === 'production' }));
  app.enableShutdownHooks();
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: false }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(process.env.PORT || 3001);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`CineForge API listening on ${host}:${port}`);
}

bootstrap().catch((error) => {
  console.error('CineForge API failed to start', error);
  process.exit(1);
});
