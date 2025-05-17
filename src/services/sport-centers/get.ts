import SportCenter from '@models/sport-center.model'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'

export const getSportCenterById = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const data = await SportCenter.findByPk(id)

     sendJson(res, data)
}
