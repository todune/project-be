import { Sequelize } from 'sequelize'

const db: Sequelize = new Sequelize(
     process.env.DB_DATABASE || 'helen_local',
     process.env.DB_USERNAME || 'postgres',
     process.env.DB_PASSWORD || 'simpletreedev',
     {
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'simpletreedev',
          database: process.env.DB_DATABASE || 'helen_local',
          host: process.env.DB_HOST || '127.0.0.1',
          dialect: 'postgres',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          logging: false,
          timezone: '+00:00',
          pool: {
               max: parseInt(process.env.DB_POOL_MAX || '10'),
               min: parseInt(process.env.DB_POOL_MIN || '2'),
               acquire: parseInt(process.env.DB_POOL_ACQUIRE || '25000'),
               idle: parseInt(process.env.DB_POOL__IDLE || '20000'),
          },
     }
)

export default db
