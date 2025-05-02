import { ErrorMiddleware } from '@common/middleware/errorMiddleware'
import { createFolderSync } from './common/utils/createFolderSync'
import { corsOptions } from '@configs/cor.config'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import bodyParser from 'body-parser'
import http, { Server } from 'http'
import db from '@configs/db.config'
import logger from '@common/logger'
import apiRoutes from './router'
import express from 'express'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'
import { seeder } from '@configs/seeder'
import { timeSlotCronJob } from '@common/cron-jobs/timeSlotCronJob'
// import '@models/index'

export class Application {
     static async createApplication() {
          await db
               .authenticate()
               // .sync({ alter: true })
               // .sync({force: true})
               .then(() => logger.info('Database connection established. (sequelize)'))
               .catch((e: Error) => logger.error(e.message))

          const app = express()
          const server = http.createServer(app)

          server.listen(process.env.PORT, () => {
               logger.info(`Server is listening on port ${process.env.PORT}`)
          })

          await this.setup(app, server)

          await seeder()

          timeSlotCronJob()

          this.handleExit(server)

          return server
     }

     static async setup(app: express.Application, server: http.Server) {
          createFolderSync(['files', 'temp'])

          app.use('/assets', express.static(path.join(__dirname, 'assets')))
          app.use('/uploads', express.static('uploads'))

          app.set('view engine', 'ejs')
          app.set('views', path.join(__dirname, 'views'))

          // set up standard middleware
          app.use(compression())
          app.use(cookieParser())
          app.use(bodyParser.urlencoded({ extended: false }))
          app.use(bodyParser.json())
          app.use(cors(corsOptions))

          // set up routes
          app.use('/api/v1', apiRoutes())

          //  catch error not found
          app.use(ErrorMiddleware.notFound)

          // set up error handlers
          app.use(ErrorMiddleware.handle)
     }

     private static handleExit(express: Server) {
          process.on('uncaughtException', (err: unknown) => {
               logger.error('Uncaught exception', err)
               this.shutdownProperly(1, express)
          })
          process.on('unhandledRejection', (reason: unknown | null | undefined) => {
               logger.error('Unhandled Rejection at promise', reason)
               this.shutdownProperly(2, express)
          })
          process.on('SIGINT', () => {
               logger.info('Caught SIGINT, exiting!')
               this.shutdownProperly(128 + 2, express)
          })
          process.on('SIGTERM', () => {
               logger.info('Caught SIGTERM, exiting')
               this.shutdownProperly(128 + 2, express)
          })
          process.on('exit', () => {
               logger.info('Exiting process...')
          })
     }

     private static shutdownProperly(exitCode: number, server: Server) {
          Promise.resolve()
               .then(() => server.close())
               .then(() => db.close())
               .then(() => {
                    logger.info('Shutdown complete, bye bye!')
                    process.exit(exitCode)
               })

               .catch((err) => {
                    logger.error('Error during shutdown', err)
                    process.exit(1)
               })
     }
}
