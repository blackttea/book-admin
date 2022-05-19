import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { logger } from './middleware/logger.middleware';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AnyExceptionFilter } from './filter/any-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 全局路由前缀
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true }));
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AnyExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(logger);
  await app.listen(3000);
}
bootstrap();
