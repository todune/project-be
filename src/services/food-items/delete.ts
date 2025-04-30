import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import FoodItem from '@models/food.model'
import { Request, Response } from 'express'

export const deleteFoodItem = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await FoodItem.findByPk(id)
     if (!itemExist) throw new ApiError('Đồ ăn/uống không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa đồ ăn/uống thành công')
}
