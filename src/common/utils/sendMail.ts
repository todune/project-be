import nodemailer from 'nodemailer'
import logger from '@common/logger'
import 'dotenv/config'

const MAIL_FROM = 'info@itomo.vn'

export const transporter = nodemailer.createTransport({
     service: process.env.MAIL_HOST,
     auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
     },
})

export const sendMail = async (
     //   from: string,
     to: string,
     subject: string,
     html: string
) => {
     const mailOptions = {
          from: MAIL_FROM,
          to: to,
          subject: subject,
          html: html,
     }

     logger.info(`Sending mail to - ${to}`)
     transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
               logger.error('Send mail error: ' + error.message)
          } else {
               logger.info('Email sent: ' + info.response)
          }
     })
}
