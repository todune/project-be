import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
     NODE_ENV: z
          .enum(['development', 'production', 'test'])
          .default('development'),
     PORT: z.string().transform(Number).default('3000'),

     // Database
     DATABASE_URL: z.string(),

     // Redis
     REDIS_URL: z.string(),

     // Security
     JWT_SECRET: z.string(),
     REFRESH_TOKEN_SECRET: z.string(),
     JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
     JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
     ALLOWED_ORIGINS: z.string().transform((str) => str.split(',')),
     WHITELIST_IPS: z
          .string()
          .transform((str) => str.split(','))
          .default(''),
     MAX_DEVICES_PER_USER: z.string().transform(Number).default('5'),

     // Rate limiting
     RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
     RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

     // Authentication
     ENABLE_2FA: z
          .string()
          .transform((str) => str === 'true')
          .default('false'),

     // Session
     SESSION_SECRET: z.string(),
     SESSION_DURATION: z.string().transform(Number).default('86400000'),
})

export const EnvConfig = envSchema.parse(process.env)
