import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'

export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || moment().year()
    
    // Generate array of month numbers (1-12)
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    
    // Query revenue data for the specified year
    const revenueData = await Promise.all(
      months.map(async (month) => {
        const startDate = moment(`${year}-${month}-01`).startOf('month').toDate()
        const endDate = moment(`${year}-${month}-01`).endOf('month').toDate()
        
        const total = await Booking.sum('total_price', {
          where: {
            status: 'Đã thanh toán',
            created_at: {
              [Op.between]: [startDate, endDate]
            }
          }
        }) || 0
        
        return {
          month,
          total: parseFloat(total.toString())
        }
      })
    )
    
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: revenueData
    })
  } catch (error) {
    console.error('Error fetching monthly revenue:', error)
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      error
    })
  }
}