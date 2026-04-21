// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas → /api/v1/...
  app.setGlobalPrefix('api/v1');

  // CORS — en producción reemplazar origin por el dominio real del frontend
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Validación global de DTOs con class-validator
  // whitelist: descarta propiedades que no están en el DTO
  // forbidNonWhitelisted: lanza error si llegan propiedades extra
  // transform: convierte automáticamente los tipos (string → number, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro global de excepciones HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global de respuestas (formato { success, data, timestamp })
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger — solo disponible fuera de producción
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Cyber Center API')
      .setDescription('API de gestión para cyber / gaming center')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    console.log(
      `📄 Swagger disponible en: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
    );
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en: http://localhost:${port}/api/v1`);
}

bootstrap();