// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import supabaseConfig from './config/supabase.config';
import redisConfig from './config/redis.config';
import { DatabaseModule } from './database/database.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ComputersModule } from './modules/computers/computers.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SalesModule } from './modules/sales/sales.module';
import { ProductsModule } from './modules/products/products.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { EventsModule } from './modules/events/events.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';

@Module({
  imports: [
    // Variables de entorno disponibles en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, supabaseConfig, redisConfig],
      envFilePath: '.env',
    }),

    // Base de datos (TypeORM + Supabase client)
    DatabaseModule,

    // Bull con Redis para colas y timers de sesiones
    BullModule.forRootAsync({
      useFactory: () => {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        const parsed = new URL(url);
        return {
          redis: {
            host: parsed.hostname,
            port: parseInt(parsed.port, 10) || 6379,
            password: parsed.password || undefined,
            tls: url.startsWith('rediss://') ? {} : undefined,
          },
        };
      },
    }),

    // Módulos del dominio
    AuthModule,
    UsersModule,
    ComputersModule,
    SessionsModule,
    MetricsModule,
    NotificationsModule,
    SalesModule,
    ProductsModule,
    ExpensesModule,
    EventsModule,
    MaintenanceModule,
  ],
})
export class AppModule {}