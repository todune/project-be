import { getDateRangeCondition } from '@common/utils/getDateRangeCondition'
import Booking from '@models/booking.model'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize'

export const getBookingStatus = async (req: Request, res: Response) => {
     const { startDate, endDate } = req.query as { startDate?: string; endDate?: string }
     const dateCondition = getDateRangeCondition(startDate, endDate)

     const whereClause: any = {}
     if (dateCondition) {
          whereClause.created_at = dateCondition // Assuming created_at is relevant
     }

     // Kết quả từ findAll + group + raw: true cần được định nghĩa interface
     const statusCounts: any[] = (await Booking.findAll({
          attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
          where: whereClause,
          group: ['status'],
          raw: true, // Lấy kết quả dạng object thuần
     })) as any[] // Type assertion cho kết quả raw

     // Format lại output
     const formattedStatusCounts: { [key: string]: number } = statusCounts.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count, 10) // Chuyển đổi count từ string sang number
          return acc
     }, {} as { [key: string]: number })

     return res.status(200).json({
          statusCode: 200,
          success: true,
          message: 'Success',
          data: formattedStatusCounts,
     })
}
