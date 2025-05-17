import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import { Request, Response } from 'express'

export const getTimeSlotById = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const data = await TimeSlot.findByPk(id)

     sendJson(res, data)
}
