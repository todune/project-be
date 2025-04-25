import winston from 'winston'
import { Request } from 'express'
import path from 'path'
import moment from 'moment'
import 'dotenv/config'

class Logger {
     private logger: winston.Logger
     private currentDate: string
     private fileTransport: winston.transports.FileTransportInstance
     private isDev: boolean

     constructor() {
          this.isDev = process.env.NODE_ENV === 'development'
          this.currentDate = this.getCurrentDate()
          this.fileTransport = new winston.transports.File({
               filename: this.getLogFileName(),
               level: 'info',
               silent: true, // not write file
               format: winston.format.printf(({ message }) => {
                    return `${moment()
                         .local()
                         .format('YYYY-MM-DD HH:mm:ss')} ${message}`
               }),
          })

          this.logger = winston.createLogger({
               format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.json(),
                    winston.format.simple(),
                    winston.format.printf(({ level, message }) => {
                         return `${level}: ${message}`
                    })
               ),
               level: 'info',
               transports: [
                    new winston.transports.Console(),
                    this.fileTransport,
               ],
          })
     }

     private getCurrentDate(): string {
          return moment().local().format('YYYY-MM-DD')
     }

     private getLogFileName(): string {
          const logDir = path.join(__dirname, '../../logs')
          return path.join(logDir, `${this.currentDate}.log`)
     }

     private updateLogFile() {
          const newDate = this.getCurrentDate()
          if (newDate !== this.getCurrentDate()) {
               this.fileTransport = new winston.transports.File({
                    filename: this.getLogFileName(),
                    level: 'info',
                    silent: false,
                    format: winston.format.printf(
                         ({ message }) =>
                              `${moment()
                                   .local()
                                   .format('YYYY-MM-DD HH:mm:ss')} ${message}`
                    ),
               })
               this.logger.clear()
               this.logger.add(new winston.transports.Console())
               this.logger.add(this.fileTransport)
          }
     }

     private log(
          level: 'info' | 'warn' | 'error',
          message: string,
          error?: Error
     ) {
          if (this.isDev || level !== 'info') {
               if (error) {
                    console.log('------- THROW ERROR [START] -------')
                    console.log(error)
                    console.log('------- THROW ERROR [END] -------')
               }
               const fullMessage = error
                    ? `${message}: ${error.message}`
                    : message
               // this.updateLogFile()
               this.logger.log(level, fullMessage)
          }
     }

     init(req: Request) {
          this.log('info', `>>> ${req.method} ${req.url}`)
     }

     error(message: string, error?: Error) {
          this.log('error', message, error)
     }

     info(message: string) {
          this.log('info', message)
     }

     warn(message: string, error?: Error) {
          this.log('warn', message, error)
     }

     logToFile(message: string) {
          this.updateLogFile()
          this.logger.info(message)
     }
}

const logger = new Logger()

export default logger
