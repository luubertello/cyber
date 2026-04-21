import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // En producción Supabase requiere SSL
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    // Las entidades se registran en cada módulo con forFeature()
    // autoLoadEntities las recoge automáticamente
    autoLoadEntities: true,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    extra: {
        max: 10,
    },
  }),
);