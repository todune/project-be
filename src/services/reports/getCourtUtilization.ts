import { Request, Response } from 'express'
import TimeSlot from '@models/time-slot.model'
import Court from '@models/court.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'

export const getCourtUtilization = async (req: Request, res: Response) => {
  try {
    // Get the start and end of the current month
    const startOfMonth = moment().startOf('month').toDate()
    const endOfMonth = moment().endOf('month').toDate()
    
    // For each court, calculate the percentage of booked time slots
    const courts = await Court.findAll({
      attributes: ['id', 'name'],
      limit: 10,
      order: [['id', 'ASC']]
    })
    
    const utilizationData = await Promise.all(
      courts.map(async (court) => {
        // Total time slots for this court in current month
        const totalSlots = await TimeSlot.count({
          where: {
            court_id: court.id,
            date: {
              [Op.between]: [startOfMonth, endOfMonth]
            }
          }
        })
        
        // Booked time slots
        const bookedSlots = await TimeSlot.count({
          where: {
            court_id: court.id,
            is_booked: true,
            date: {
              [Op.between]: [startOfMonth, endOfMonth]
            }
          }
        })
        
        // Calculate utilization percentage
        const utilization = totalSlots > 0 
          ? Math.round((bookedSlots / totalSlots) * 100) 
          : 0
        
        return {
          name: court.name,
          utilization
        }
      })
    )
    
    // Sort by utilization (highest first)
    const sortedData = utilizationData.sort((a, b) => b.utilization - a.utilization).slice(0, 6)
    
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: sortedData
    })
  } catch (error) {
    console.error('Error fetching court utilization:', error)
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      error
    })
  }
}