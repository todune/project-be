import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Slot from '@models/slot.model'
import { Request, Response } from 'express'

export const deleteSlot = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Slot.findByPk(id)
     if (!itemExist) throw new ApiError('Khung giờ không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa khung giờ thành công')
}
