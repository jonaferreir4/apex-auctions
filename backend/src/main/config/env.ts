import dotenv from 'dotenv';

dotenv.config();

const rawCors = process.env.CORS_ORIGIN || '*';
const corsOrigins = rawCors === '*' ? '*' : rawCors.includes(',') ? rawCors.split(',').map(s => s.trim()) : rawCors;

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/leilao_verzel?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-verzel-elite-dev-2026',
  CORS_ORIGIN: corsOrigins
};
