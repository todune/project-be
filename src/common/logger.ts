import { Request } from 'express'
import winston from 'winston'
import moment from 'moment'
import path from 'path'
import 'dotenv/config'

class Logger {
     private static instance: Logger
     private logger: winston.Logger
     private currentDate: string
     private fileTransport: winston.transports.FileTransportInstance
     private isDev: boolean

     private constructor() {
          this.isDev = process.env.NODE_ENV === 'development'
          this.currentDate = this.getCurrentDate()
          this.fileTransport = this.createFileTransport()

          this.logger = winston.createLogger({
               level: 'debug',
               format: this.getFormat(),
               transports: [new winston.transports.Console(), this.fileTransport],
               exitOnError: false, // Do not exit on handled exceptions
          })
     }

     public static getInstance(): Logger {
          if (!Logger.instance) {
               Logger.instance = new Logger()
          }
          return Logger.instance
     }

     private getCurrentDate(): string {
          return moment().local().format('YYYY-MM-DD')
     }

     private getLogFileName(): string {
          const logDir = path.join(__dirname, '../../logs')
          return path.join(logDir, `${this.currentDate}.log`)
     }

     private createFileTransport(): winston.transports.FileTransportInstance {
          return new winston.transports.File({
               filename: this.getLogFileName(),
               level: 'info',
               silent: !this.isDev, // Write to file only in production by default
               format: winston.format.combine(
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    winston.format.printf(({ timestamp, message }) => `${timestamp} ${message}`)
               ),
          })
     }

     private getFormat() {
          return winston.format.combine(
               winston.format.colorize(),
               // winston.format.json(),
               winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
               // winston.format.printf(({ timestamp, level, message, stack }) => {
               //      return stack
               //           ? `${timestamp} ${level}: ${message} - ${stack}`
               //           : `${timestamp} ${level}: ${message}`
               // })
               winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    let formatted = `${timestamp} ${level}: ${message}`
                    if (Object.keys(meta).length > 0) {
                         formatted += ` ${JSON.stringify(meta, null, 2)}`
                    }
                    return formatted
               })
          )
     }

     public init(req: Request) {
          this.logger.info(`✈️✈️✈️  ${req.method} ${req.originalUrl}`)
     }

     public error(message: string, meta?: any) {
          this.logger.error(`🚨🚨🚨  ${message}`, meta)
     }

     public info(message: string) {
          this.logger.info(message)
     }

     public warn(message: string, meta?: any) {
          this.logger.warn(message, meta)
     }

     public debug(message: string, data?: any) {
          console.log(message, data || '')
     }

     public os() {
          const used = process.memoryUsage().heapUsed / 1024 / 1024
          this.logger.debug(Math.round(used * 100) / 100) + ' MB'
     }
}

const logger = Logger.getInstance()
export default logger
