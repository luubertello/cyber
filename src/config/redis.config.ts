import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
  const parsed = new URL(url);

  return {
    url,
    host: parsed.hostname,
    port: parseInt(parsed.port, 10) || 6379,
    password: parsed.password || undefined,
    // Upstash requiere TLS cuando la URL usa rediss://
    tls: url.startsWith('rediss://') ? {} : undefined,
  };
});