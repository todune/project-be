import { Response } from 'express'

export const sendJson = (res: Response, data: any, message: string = 'Success') => {
     const { menu, pagination, items } = data
     return res.status(200).json({
          statusCode: 200,
          success: true,
          message,
          data: data.id ? data : menu ? data.data.items : items,
          pagination: data.id ? undefined : menu ? data.data.pagination : pagination,
          menu,
     })
}
