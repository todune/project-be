import 'dotenv/config'
import { sendMail } from '../common/functions/sendMail'
import { AESEncrypt } from './aes'

export const sendMailToUser = async (userInfo: any, orderId: number) => {
     const aes = new AESEncrypt()
     const { iv: ivHex, encryptedData } = aes.encrypt(userInfo.email)
     console.log(userInfo.email, ivHex, encryptedData)

     const approvalLink = `${process.env.CLIENT_URL}/orders?o=${orderId}&i=${ivHex}&e=${encryptedData}`
     const emailSubject = `Yêu cầu nhận hàng`
     const emailBody = `
                         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                              <h2 style="color: #2e6da4;">Xin chào ${userInfo.firstName} ${userInfo.lastName},</h2>
                              <p><b>Kho thiết bị Helen</b> đã gửi yêu cầu xác nhận đã nhận thiết bị thành công.</p>
                              <p>Vui lòng truy cập vào đường dẫn dưới đây để nhận hàng:</p>
                              <p style="text-align: center; margin: 20px 0;">
                              <a href="${approvalLink}" style="background-color: #2e6da4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                   Nhận hàng
                              </a>
                              </p>
                              <p>Nếu liên kết không hoạt động, bạn có thể sao chép và dán đường dẫn sau vào trình duyệt của mình:</p>
                              <p><a href="${approvalLink}">${approvalLink}</a></p>
                              <p>Lưu ý: Chỉ xác nhận khi đã nhận và kiểm tra đơn hàng thực tế.</p>
                              <p>Trân trọng,</p>
                              <p>Helen Warehouse</p>
                         </div>
                         `

     await sendMail(userInfo.email, emailSubject, emailBody)
}
