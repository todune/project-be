import logger from '@common/logger'
import 'dotenv/config'
import { Redis } from 'ioredis'

export interface RedisConfig {
     port: number
     host: string
     password: string
     // db: number
     maxRetriesPerRequest: number | null
     // connectTimeout: number
}

export const REDIS_CONFIG: RedisConfig = {
     port: Number(process.env.REDIS_PORT) || 6379,
     host: process.env.REDIS_HOST || 'localhost',
     password: process.env.REDIS_PASS || '',
     // db: Number(process.env.REDIS_DB) || 0,
     // maxRetriesPerRequest: Number(process.env.REDIS_MAX_RETRIES) || 10,
     // connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT) || 10000,
     maxRetriesPerRequest: null,
}

const redisConnection = new Redis(REDIS_CONFIG)

redisConnection.on('connect', () => {
     logger.info('Connected to Redis')
})

redisConnection.on('error', (e: any) => {
     logger.error('Redis connection error:')
})

export default redisConnection
