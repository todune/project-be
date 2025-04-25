import { Dialect } from 'sequelize'
import 'dotenv/config'

interface PoolConfig {
     max: number
     min: number
     acquire: number
     idle: number
}

interface SequelizeConfig {
     username: string
     password: string | null
     database: string
     host: string
     dialect: Dialect
     port: number
     logging: boolean
     pool: PoolConfig
}

const SEQUELIZE_CONFIG: SequelizeConfig = {
     username: process.env.DB_USERNAME || 'postgres',
     password: process.env.DB_PASSWORD || 'simpletreedev',
     database: process.env.DB_DATABASE || 'test',
     host: process.env.DB_HOST || '127.0.0.1',
     dialect: 'postgres',
     port: parseInt(process.env.DB_PORT || '5432', 10),
     logging: false,
     pool: {
          max: parseInt(process.env.DB_POOL_MAX || '10'),
          min: parseInt(process.env.DB_POOL_MIN || '0'),
          acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
          idle: parseInt(process.env.DB_POOL__IDLE || '10000'),
     },
}

export default SEQUELIZE_CONFIG
