import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { logger } from './middleware/logger.middleware';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AnyExceptionFilter } from './filter/any-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // 配置 Swagger
  const options = new DocumentBuilder()
    .addBearerAuth() // 开启 BearerAuth 授权认证
    .setTitle('bookAdmin')
    .setDescription('The bookAdmin API description')
    .setVersion('1.0')
    .addTag('book-admin')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  !process.env.NODE_ENV ? SwaggerModule.setup('api-doc', app, document) : '';
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
