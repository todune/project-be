import express, { Application, Request, Response, NextFunction } from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import logger from './common/logger'
import { apiRoutes } from './routes'
import http from 'http'
import db from './db/db'
import bodyParser from 'body-parser'
import { createFolderSync } from './common/functions/createFolderSync'
import cron from 'node-cron'
import { SocketService } from './socket'
import './models/index'
import seedDatabase from './db/seed'

process.on('uncaughtException', (error: Error) => {
     logger.error(error.message)
     process.exit(1)
})

const startServer = async () => {
     cron.schedule('0 23 * * 0', () => {
          logger.info('Start delete old notifications...')
     })

     createFolderSync(['files','temp'])

     await db
          .authenticate()
          .then(() => logger.info('Database connection established.'))
          .catch((e: Error) => logger.error(e.message))
          
     // await db
     //      .sync({ force: true }) // xóa hết dữ liêụ: force:true
     //      .then(() => logger.info('Database synced.'))
     //      .catch((e: Error) => logger.error(e.message))

     // await seedDatabase()

     // init app
     const app: Application = express()
     const server = http.createServer(app)
     const port = process.env.PORT || 8000

     app.use('/assets', express.static(path.join(__dirname, 'assets')))
     app.use('/uploads', express.static('uploads'))

     app.set('view engine', 'ejs')
     app.set('views', path.join(__dirname, 'views'))

     // set up standard middleware
     app.use(cookieParser())
     app.use(bodyParser.urlencoded({ extended: false }))
     app.use(bodyParser.json())

     const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:8000',
     ]

     app.use(
          cors({
               origin: (origin, callback) => {
                    // Check if the incoming request's origin is in the allowedOrigins array
                    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                         callback(null, true)
                    } else {
                         callback(new Error('Not allowed by CORS'))
                    }
               },
               credentials: true,
          })
     )

     SocketService.initialize(server)
     const io = SocketService.getInstance()

     // set up routes
     app.use('/api/v1', apiRoutes(io))

     // set up error handlers
     app.use((err: any, req: Request, res: Response, next: NextFunction) => {
          res.status(err.status || 500)
          res.send({
               error: {
                    status: err.status || 500,
                    message: err.message,
               },
          })
     })

     //  catch error not found
     app.use((req: Request, res: Response, next: NextFunction) => {
          next('Resource not found.')
     })

     server.listen(port, () => {
          console.log(`Server running on port ${port}`)
     })
}

startServer()
