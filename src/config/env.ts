import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const toBool = (value: string | undefined, fallback: boolean) => {
  if (value == null || value === '') {
    return fallback;
  }
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

export const splitOrigins = (value?: string) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  port: parseInt(process.env.PORT || '3668', 10),
  jwtSecret: process.env.JWT_SECRET || '',
  clientUrl: process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:3000',
  allowedOrigins: splitOrigins(
    process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000',
  ),
  corsCredentials: toBool(process.env.CORS_CREDENTIALS, true),
  databaseUrl: process.env.DATABASE_URL || '',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbUsername: process.env.DB_USERNAME || 'postgres',
  dbPassword: (process.env.DB_PASSWORD || '').toString(),
  dbName: process.env.DB_DATABASE || 'ims',
  dbSsl: toBool(process.env.DB_SSL, false),
  dbSynchronize: toBool(process.env.DB_SYNCHRONIZE, true),
};

export default env;
