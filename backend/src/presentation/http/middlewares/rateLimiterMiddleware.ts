import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    error: 'Muitas requisições originadas deste IP. Tente novamente em alguns minutos.'
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    error: 'Muitas tentativas de autenticação. Por segurança, aguarde 15 minutos antes de tentar novamente.'
  }
});

export const bidRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    error: 'Limite de lances por minuto atingido. Aguarde alguns instantes antes de enviar um novo lance.'
  }
});
