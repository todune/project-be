import { Request, Response } from 'express'
import TimeSlot from '@models/time-slot.model'
import Court from '@models/court.model'
import Category from '@models/category.model'
import { Op } from 'sequelize'
import moment from 'moment-timezone'
import { AppMsg } from '@common/utils/appMsg'

export const getOccupancyRateReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, categoryId } = req.query

        const start = startDate
            ? moment(startDate as string).startOf('day').toDate()
            : moment().startOf('day').toDate()

        const end = endDate
            ? moment(endDate as string).endOf('day').toDate()
            : moment().endOf('day').toDate()

        // Build court filter
        const courtWhereCondition: any = {}
        if (categoryId && categoryId !== "undefined" && categoryId !== "all") {
            courtWhereCondition.category_id = categoryId
        }

        // Get courts with category info
        const courts = await Court.findAll({
            attributes: ['id', 'category_id'],
            where: courtWhereCondition,
            include: [
                {
                    model: Category,
                    as: 'catCourtData',
                    attributes: ['id', 'name']
                }
            ]
        })

        if (courts.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                data: []
            })
        }

        const courtIds = courts.map(court => court.id)

        // Get all time slots
        const allTimeSlots = await TimeSlot.findAll({
            attributes: ['start_time', 'is_booked', 'court_id'],
            where: {
                date: { [Op.between]: [start, end] },
                court_id: { [Op.in]: courtIds }
            }
        })

        if (allTimeSlots.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                data: []
            })
        }

        // Get unique time slots
        const uniqueTimeSlots = [...new Set(allTimeSlots.map(slot => slot.start_time.substring(0, 5)))]
            .sort()

        // Helper function
        const getTimeFrame = (timeSlot: string): string => {
            const hour = parseInt(timeSlot.split(":")[0])
            if (hour >= 6 && hour < 12) return "morning"
            if (hour >= 12 && hour < 18) return "afternoon"
            if (hour >= 18 && hour < 22) return "evening"
            return "night"
        }

        // Group courts by category
        const courtsByCategory: { [key: number]: { categoryId: number, categoryName: string, courtIds: number[] } } = {}

        courts.forEach(court => {
            const catId = court.category_id
            if (!courtsByCategory[catId]) {
                courtsByCategory[catId] = {
                    categoryId: catId,
                    categoryName: court.dataValues.catCourtData?.name || 'N/A',
                    courtIds: []
                }
            }
            courtsByCategory[catId].courtIds.push(court.id)
        })

        // Calculate utilization for each category-timeSlot combination
        const result: any[] = []

        Object.values(courtsByCategory).forEach(category => {
            uniqueTimeSlots.forEach(timeSlot => {
                // Count total slots for this category-timeSlot combination (across all courts in category)
                const categoryTimeSlots = allTimeSlots.filter(slot =>
                    category.courtIds.includes(slot.court_id) &&
                    slot.start_time.substring(0, 5) === timeSlot
                )

                if (categoryTimeSlots.length > 0) {
                    const totalSlots = categoryTimeSlots.length
                    const bookedSlots = categoryTimeSlots.filter(slot => slot.is_booked).length
                    const utilization = Math.round((bookedSlots / totalSlots) * 100)

                    result.push({
                        categoryId: category.categoryId,
                        catName: category.categoryName,
                        timeFrame: getTimeFrame(timeSlot),
                        timeSlot: timeSlot,
                        utilization: utilization,
                        totalSlots: totalSlots,
                        bookedSlots: bookedSlots
                    })
                }
            })
        })

        return res.status(200).json({
            statusCode: 200,
            success: true,
            data: result
        })

    } catch (error: any) {
        console.error('Error in occupancy rate report:', error)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: AppMsg.serverError,
            error: error.message
        })
    }
}