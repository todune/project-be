import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import FoodItem from '@models/food.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateFoodItemSchema = z.object({
     name: z.string().nullable().optional(),
     description: z.string().nullable().optional(),
     price: z.number().nullable().optional(),
     quantity: z.number().nullable().optional(),
     image_url: z.string().nullable().optional(),
     category_id: z.number().nullable().optional(),
})

export type UpdateFoodItemInput = z.infer<typeof updateFoodItemSchema>

export const updateFoodItem = async (req: Request, res: Response) => {
     const body = req.body as UpdateFoodItemInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await FoodItem.findByPk(id)
     if (!itemExist) throw new ApiError('Đồ ăn/uống không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật đồ ăn/uống thành công')
}
