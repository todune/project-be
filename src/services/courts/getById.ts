import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import { Request, Response } from 'express'
import Court from '@models/court.model'

export const getCourtById = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     sendJson(res, null)
}
