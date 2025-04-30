import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import FoodItem from '@models/food.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createFoodItemSchema = z.object({
     name: z.string({ required_error: 'Tên đồ ăn/uống không được để trống' }),
     description: z.string().nullable().optional(),
     price: z.number({ required_error: 'Giá đồ ăn/uống không được để trống' }),
     quantity: z.number().optional().default(0),
     image_url: z.string().nullable().optional(),
     category_id: z.number({ required_error: 'Danh mục đồ ăn/uống không được để trống' }),
})

export type CreateFoodItemInput = z.infer<typeof createFoodItemSchema>

export const createFoodItem = async (req: Request, res: Response) => {
     const { name, description, price, quantity, image_url, category_id } =
          req.body as CreateFoodItemInput

     const isExist = await FoodItem.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên đồ ăn/uống đã tồn tại', 409)

     const foodItem = await FoodItem.create({
          name,
          description,
          price,
          quantity,
          image_url,
          category_id,
     })

     sendJson(res, { id: foodItem.dataValues.id }, 'Tạo đồ ăn/uống thành công')
}
