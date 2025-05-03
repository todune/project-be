import { getDateRangeCondition } from '@common/utils/getDateRangeCondition'
import Booking from '@models/booking.model'
import { Request, Response } from 'express'

export const getRevenueSummary = async (req: Request, res: Response) => {
     const { startDate, endDate } = req.query as { startDate?: string; endDate?: string }
     const dateCondition = getDateRangeCondition(startDate, endDate)

     const whereClause: any = { status: 'Đã thanh toán' }
     if (dateCondition) {
          whereClause.created_at = dateCondition
     }

     // Sequelize.sum trả về Promise<number | null>
     const totalRevenue: number | null = await Booking.sum('total_price', {
          where: whereClause,
     })

     // Sequelize.count trả về Promise<number>
     const totalBookings: number = await Booking.count({
          where: whereClause,
     })

     return res.status(200).json({
          statusCode: 200,
          success: true,
          message: 'Success',
          data: {
               totalRevenue: totalRevenue || 0,
               totalPaidBookings: totalBookings,
          },
     })
}
