import crypto from 'crypto'
import moment from 'moment-timezone'
import querystring from 'qs'

interface VnpayInput {
    orderId?: string
    amount: string
    returnUrl: string
    ipnUrl?: string
    orderDescription?: string
    orderType?: string
    language?: string
    bankCode?: string
}

// Helper function to sort object
function sortObject(obj: any) {
    const sorted: any = {}
    const str = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key))
        }
    }
    str.sort()
    for (let key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+")
    }
    return sorted
}

export const createVnpayPaymentUrl = (input: VnpayInput, ipAddr?: string) => {
    const {
        orderId,
        amount,
        returnUrl,
        ipnUrl,
        orderDescription = 'Thanh toan don hang',
        orderType = 'other',
        language = 'vn',
        bankCode = ''
    } = input

    // VNPay configuration
    const tmnCode = '1MNG21CI' // Thay bằng mã merchant của bạn
    const secretKey = 'UF95VB2R164Q4K440W0MOUJJZ9SWV5C8' // Thay bằng hash secret của bạn
    const vnpUrl = process.env.NODE_ENV === 'PROD'
        ? 'https://vnpay.vn/paymentv2/vpcpay.html'
        : 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'

    // Generate date and orderId
    const date = new Date()
    const createDate = moment(date).format('YYYYMMDDHHmmss')
    const generatedOrderId = orderId || moment(date).format('HHmmss')

    // Build VNPay params
    let vnp_Params: any = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: language,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: generatedOrderId,
        vnp_OrderInfo: orderDescription,
        vnp_OrderType: orderType,
        vnp_Amount: parseInt(amount) * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr || '127.0.0.1',
        vnp_CreateDate: createDate
    }

    // Add optional fields
    if (bankCode && bankCode !== '') {
        vnp_Params.vnp_BankCode = bankCode
    }

    if (ipnUrl && ipnUrl !== '') {
        vnp_Params.vnp_IpnUrl = ipnUrl
    }

    // Sort parameters
    vnp_Params = sortObject(vnp_Params)

    // Create signature
    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed

    // Build final URL
    const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false })

    return {
        payUrl: paymentUrl,
        orderId: generatedOrderId,
        amount: parseInt(amount),
        createDate: createDate
    }
}

// Verify VNPay response - đơn giản hóa
export const verifyVnpayResponse = (vnpayData: any, secretKey: string): boolean => {
    try {
        let vnp_Params = { ...vnpayData }
        const secureHash = vnp_Params['vnp_SecureHash']

        delete vnp_Params['vnp_SecureHash']
        delete vnp_Params['vnp_SecureHashType']

        vnp_Params = sortObject(vnp_Params)

        const signData = querystring.stringify(vnp_Params, { encode: false })
        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        return secureHash === signed
    } catch (error) {
        console.error('Error verifying VNPay response:', error)
        return false
    }
}