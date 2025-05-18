import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import User from '@models/user.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get current month start and end dates
    const now = moment()
    const monthStart = moment().startOf('month').toDate()
    const monthEnd = moment().endOf('month').toDate()
    
    // Total bookings (all time)
    const totalBookings = await Booking.count()
    
    // Monthly revenue
    const monthlyRevenue = await Booking.sum('total_price', {
      where: {
        status: 'Đã thanh toán',
        created_at: {
          [Op.between]: [monthStart, monthEnd]
        }
      }
    }) || 0
    
    // Active customers (users who made bookings in the last 3 months)
    const threeMonthsAgo = moment().subtract(3, 'months').toDate()
    const activeCustomerIds = await Booking.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('user_id')), 'user_id']],
      where: {
        created_at: {
          [Op.gte]: threeMonthsAgo
        }
      },
      raw: true
    })
    const activeCustomers = activeCustomerIds.length
    
    // Pending bookings
    const pendingBookings = await Booking.count({
      where: {
        status: 'Chờ thanh toán'
      }
    })
    
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: {
        totalBookings,
        monthlyRevenue,
        activeCustomers,
        pendingBookings
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      error
    })
  }
}