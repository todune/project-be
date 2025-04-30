import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createCategorySchema = z.object({
     name: z.string({ required_error: 'Tên danh mục không được để trống' }),
     type: z.string({ required_error: 'Loại danh mục không được để trống' }),
     description: z.string().nullable().optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const createCategory = async (req: Request, res: Response) => {
     const { name, type, description } = req.body as CreateCategoryInput

     const isExist = await Category.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên danh mục đã tồn tại', 409)

     const category = await Category.create({ name, type, description })

     sendJson(res, { id: category.dataValues.id }, 'Tạo danh mục thành công')
}
