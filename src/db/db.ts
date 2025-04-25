import { Sequelize } from 'sequelize'
import SEQUELIZE_CONFIG from '../config/sequelize.config'

const { username, password, database, host, dialect, port, logging, pool } = SEQUELIZE_CONFIG

const sequelizePassword = password ?? ''

const db: Sequelize = new Sequelize(
     database,
     username,
     sequelizePassword,
     {
          host,
          dialect,
          port,
          logging,
          pool
     },
)

export default db
