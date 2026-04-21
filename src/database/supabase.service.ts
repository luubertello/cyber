import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.getOrThrow<string>('supabase.url');
    const key = this.configService.getOrThrow<string>('supabase.serviceRoleKey');

    this.client = createClient(url, key, {
      auth: {
        // El backend usa service role, no necesita persistir sesiones
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // Exponemos el cliente para usarlo en cualquier servicio que lo inyecte
  getClient(): SupabaseClient {
    return this.client;
  }
}