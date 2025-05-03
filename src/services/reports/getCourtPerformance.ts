import { getDateRangeCondition } from '@common/utils/getDateRangeCondition'
import Booking from '@models/booking.model'
import Court from '@models/court.model'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize'

export const getCourtPerformance = async (req: Request, res: Response) => {
     const { startDate, endDate } = req.query as { startDate?: string; endDate?: string }
     const dateCondition = getDateRangeCondition(startDate, endDate)

     const whereClause: any = { status: 'Đã thanh toán' } // Chỉ tính các booking đã paid
     if (dateCondition) {
          whereClause.created_at = dateCondition
     }

     // Kết quả từ findAll + include + group + raw: true cần được định nghĩa interface
     const courtPerformance: any[] = (await Booking.findAll({
          attributes: [
               [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingCount'],
               [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue'],
          ],
          include: [
               {
                    model: Court,
                    as: 'courtBookingData', // Sử dụng alias đã định nghĩa trong association
                    attributes: ['id', 'name', 'code'],
               },
          ],
          where: whereClause,
          group: ['court_id', 'courtBookingData.id'], // Group theo court_id và primary key của model được include
          raw: true,
     })) as any[] // Type assertion cho kết quả raw

     // Format lại output để dễ sử dụng hơn
     const formattedPerformance = courtPerformance.map((item) => ({
          courtId: item.court_id,
          courtName: item['courtBookingData.name'],
          courtCode: item['courtBookingData.code'],
          bookingCount: parseInt(item.bookingCount, 10), // Chuyển đổi từ string sang number
          totalRevenue: parseFloat(item.totalRevenue), // Chuyển đổi từ string sang float
     }))

     return res.status(200).json({
          statusCode: 200,
          success: true,
          message: 'Success',
          data: formattedPerformance,
     })
}
