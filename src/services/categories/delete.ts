import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import { Request, Response } from 'express'

export const deleteCategory = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Category.findByPk(id)
     if (!itemExist) throw new ApiError('Danh mục không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa danh mục thành công')
}
