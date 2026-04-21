import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseService } from './supabase.service';

@Global() // Global para que SupabaseService esté disponible en toda la app sin reimportar
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow('database'),
    }),
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class DatabaseModule {}