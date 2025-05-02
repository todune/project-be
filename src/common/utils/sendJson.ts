import { Response } from 'express'

export const sendJson = (res: Response, data: any, message: string = 'Success') => {
     const { items, ...rest } = data
     return res.status(200).json({
          statusCode: 200,
          success: true,
          message,
          data: data.id ? data : items,
          pagination: data.id ? undefined : rest,
     })
}
