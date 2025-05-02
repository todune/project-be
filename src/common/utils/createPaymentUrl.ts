import crypto from 'crypto'
import axios from 'axios'

function createSignature(data: string, secretKey: string): string {
     return crypto.createHmac('sha256', secretKey).update(data).digest('hex')
}

const paymentEnv = process.env.PAYMENT_ENV || 'SANDBOX'

export const createPayMoMoUrl = async (input: {
     orderId: string
     amount: string
     redirectUrl: string
     ipnUrl: string
}) => {
     const { redirectUrl, ipnUrl } = input
     const endpoint =
          paymentEnv === 'PROD'
               ? 'https://payment.momo.vn/v2/gateway/api/create'
               : 'https://test-payment.momo.vn/v2/gateway/api/create'

     const partnerCode = 'MOMOBKUN20180529'
     const accessKey = 'klm05TvNBzhg7h7j'
     const secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa'

     const amount = (parseFloat(input.amount) * 100) / 100
     const orderInfo = 'Thanh toán qua MOMO'
     const extraData = ''
     const requestId = partnerCode + new Date().getTime()
     const requestType = 'payWithATM' // captureWallet // payWithATM
     const orderId = `${input.orderId}-${requestId}` // `${input.orderId}${requestId}`

     const rawHash = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
     const signature = createSignature(rawHash, secretKey)

     const data = {
          partnerCode,
          partnerName: 'Test',
          storeId: 'MomoTestStore',
          requestId,
          amount,
          orderId,
          orderInfo,
          redirectUrl,
          ipnUrl,
          lang: 'vi',
          extraData,
          requestType,
          signature,
     }

     const response = await axios.post(endpoint, data, {
          headers: {
               'Content-Type': 'application/json',
          },
     })

     const result = response.data

     if (result && result.payUrl) {
          return result.payUrl
     }
     return null
}
