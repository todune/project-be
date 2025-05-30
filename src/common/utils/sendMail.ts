import 'dotenv/config'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import logger from '../logger'
import QRCode from 'qrcode'
import path from 'path'
import { createCanvas } from 'canvas'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

// Cấu hình Cloudinary
cloudinary.config({
     cloud_name: 'dxe4gwydm',
     api_key: '595257836751858',
     api_secret: 'FrCE6r-O-kjvddUGwdEYTHa8JdU',
})

// Hàm tạo QR Code
const generateQRCode = async (value: string): Promise<string> => {
     const fileName = `${value}.png`
     const filePath = path.join('uploads/files', fileName)
     try {
          // const canvas = createCanvas(300, 300)
          // await QRCode.toCanvas(canvas, value, {
          //      errorCorrectionLevel: 'H',
          //      margin: 1,
          //      color: {
          //           dark: '#000000',
          //           light: '#ffffff',
          //      },
          // })
          // const buffer = canvas.toBuffer('image/png')
          // fs.writeFileSync(filePath, buffer)
          // return process.env.HOST + `/uploads/files/${fileName}`
          // Tạo QR code buffer
          const buffer = await QRCode.toBuffer(value, {
               width: 300,
               margin: 2,
               color: {
                    dark: '#000000',
                    light: '#FFFFFF',
               },
          })

          // Upload lên Cloudinary
          const result = (await new Promise((resolve, reject) => {
               cloudinary.uploader
                    .upload_stream(
                         {
                              resource_type: 'image',
                              public_id: `qr-codes/booking-${value.replace('BOOKING-', '')}`,
                              format: 'png',
                         },
                         (error, result) => {
                              if (error) reject(error)
                              else resolve(result)
                         }
                    )
                    .end(buffer)
          })) as any

          console.log('QR Code uploaded to Cloudinary:', result.secure_url)
          return result.secure_url
     } catch (error) {
          console.error('Error generating QR code:', error)
          return ''
     }
}

// Template gửi mail thông báo vé đặt sân
export const sendBookingTicketToUser = async (bookingInfo: any) => {
     const qrValue = `BOOKING-${bookingInfo.booking_id}`
     const qrCodeImage = await generateQRCode(qrValue)
     console.log('QR Code Image URL:', qrCodeImage)

     const emailSubject = `🎾 Vé đặt sân thành công - Mã booking #${bookingInfo.booking_id}`

     const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <!-- Header -->
      <div style="background-color: #2e6da4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎾 Đặt Sân Thành Công!</h1>
      </div>
      
      <!-- Content -->
      <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #2e6da4; margin-top: 0;">Xin chào ${bookingInfo.customerName},</h2>
        
        <p>Cảm ơn bạn đã đặt sân tại <strong>${
             bookingInfo?.sportCenter?.name || 'SportCenter'
        }</strong>. Đặt sân của bạn đã được xác nhận thành công!</p>
        
        <!-- QR Code Section -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px; border: 2px dashed #2e6da4;">
          <h3 style="color: #2e6da4; margin-bottom: 15px;">🎫 Vé Điện Tử Của Bạn</h3>
          ${
               qrCodeImage
                    ? `<img src="${qrCodeImage}" alt="QR Code" style="max-width: 200px; height: auto; border: 1px solid #ddd; border-radius: 8px;">`
                    : ''
          }
          <p style="font-size: 18px; font-weight: bold; color: #333; margin-top: 10px;">Mã vé: ${qrValue}</p>
          <p style="color: #666; font-size: 14px;">Vui lòng xuất trình QR code này khi đến sân</p>
        </div>
        
        <!-- Booking Details -->
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2e6da4; margin-top: 0; border-bottom: 2px solid #2e6da4; padding-bottom: 10px;">📋 Thông Tin Đặt Sân</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; width: 40%;">🏟️ Tên sân:</td>
              <td style="padding: 10px 0;">${bookingInfo.courtName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">🏷️ Loại sân:</td>
              <td style="padding: 10px 0;">${bookingInfo.categoryName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">📍 Địa điểm:</td>
              <td style="padding: 10px 0;">${bookingInfo.courtLocation}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">📅 Ngày đặt:</td>
              <td style="padding: 10px 0;">${bookingInfo.bookingDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">⏰ Thời gian:</td>
              <td style="padding: 10px 0;">${bookingInfo.startTime} - ${bookingInfo.endTime}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">💰 Tổng tiền:</td>
              <td style="padding: 10px 0; color: #e74c3c; font-weight: bold; font-size: 16px;">${
                   bookingInfo.totalPrice
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">📊 Trạng thái:</td>
              <td style="padding: 10px 0;">
                <span style="background-color: #27ae60; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                  ✅ Đã thanh toán
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Important Notes -->
        <div style="background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h4 style="color: #856404; margin-top: 0;">⚠️ Lưu Ý Quan Trọng:</h4>
          <ul style="color: #856404; margin: 0; padding-left: 20px;">
            <li>Vui lòng có mặt tại sân <strong>15 phút trước</strong> giờ đặt</li>
            <li>Mang theo <strong>QR code</strong> này để check-in</li>
            <li>Liên hệ hotline nếu cần hỗ trợ: <strong>${
                 bookingInfo?.sportCenter?.phone_number || '0123456789'
            }</strong></li>
            <li>Nếu cần hủy đặt sân, vui lòng thông báo trước <strong>2 giờ</strong></li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2e6da4; margin-top: 0;">📞 Thông Tin Liên Hệ</h3>
          <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${
               bookingInfo?.sportCenter?.email || 'support@sportcenter.com'
          }</p>
          <p style="margin: 5px 0;"><strong>📱 Hotline:</strong> ${
               bookingInfo?.sportCenter?.phone_number || '0123456789'
          }</p>
          <p style="margin: 5px 0;"><strong>🌐 Website:</strong> <a href="${
               process.env.CLIENT_URL
          }" style="color: #2e6da4;">${process.env.CLIENT_URL}</a></p>
        </div>
        
        <p style="text-align: center; color: #666; font-style: italic; margin-top: 30px;">
          Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #2e6da4; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px;">
          © 2024 ${bookingInfo?.sportCenter?.name || 'SportCenter'}. All rights reserved.
        </p>
      </div>
    </div>
  `

     await sendMail(bookingInfo.customerEmail, emailSubject, emailBody)
}

const MAIL_FROM = 'duong.itomo@gmail.com'

export const transporter = nodemailer.createTransport({
     // host: 'mail.2021603666-haui.io.vn',
     service: 'gmail',
     // secure: false,
     // port: 465,
     auth: {
          user: 'duong.itomo@gmail.com',
          pass: 'skky wzqu cfcc yzfh',
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
