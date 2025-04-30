import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateCategorySchema = z.object({
     name: z.string().nullable().optional(),
     type: z.string().nullable().optional(),
     description: z.string().nullable().optional(),
})

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

export const updateCategory = async (req: Request, res: Response) => {
     const body = req.body as UpdateCategoryInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Category.findByPk(id)
     if (!itemExist) throw new ApiError('Danh mục không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật danh mục thành công')
}
