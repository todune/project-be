import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Court from '@models/court.model'
import { Request, Response } from 'express'

export const deleteCourt = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Court.findByPk(id)
     if (!itemExist) throw new ApiError('Sân không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa sân thành công')
}
