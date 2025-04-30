import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import EquipmentItem from '@models/equipment.model'
import { Request, Response } from 'express'

export const deleteEquipmentItem = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await EquipmentItem.findByPk(id)
     if (!itemExist) throw new ApiError('Thiết bị không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa thiết bị thành công')
}
