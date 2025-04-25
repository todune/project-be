import nodemailer from 'nodemailer'
import 'dotenv/config'
import logger from '../logger'

const MAIL_FROM = 'tuanbh.itomo@gmail.com'

export const transporter = nodemailer.createTransport({
     // host: 'mail.2021603666-haui.io.vn',
     service: "gmail",
     // secure: false,
     // port: 465,
     auth: {
          user: 'tuanbh.itomo@gmail.com',
          pass: 'slsd nvug ooyj trik',
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
