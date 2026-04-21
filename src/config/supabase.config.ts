import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => ({
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  // Service role bypasea RLS — solo para el backend, nunca al frontend
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}));