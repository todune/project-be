import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Booking from '@models/booking.model'
import { Request, Response } from 'express'

export const refundBooking = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Booking.findByPk(id)
     if (!itemExist) throw new ApiError('Booking không tồn tại', 404)

     await itemExist.update({ status: 'Hoàn tiền', rejected_reason: req.body.rejected_reason || null })

     sendJson(res, { id }, 'Hoàn tiền thành công')
}
