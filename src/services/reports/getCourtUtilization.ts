import { Request, Response } from 'express'
import TimeSlot from '@models/time-slot.model'
import Court from '@models/court.model'
import Category from '@models/category.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'
import db from '@configs/db.config'

export const getCourtUtilization = async (req: Request, res: Response) => {
     try {
          // Tham số từ request
          const startDate = req.query.startDate
               ? moment(req.query.startDate as string)
                      .startOf('day')
                      .toDate()
               : moment().startOf('month').toDate()

          const endDate = req.query.endDate
               ? moment(req.query.endDate as string)
                      .endOf('day')
                      .toDate()
               : moment().endOf('month').toDate()

          // Lấy tất cả danh mục
          const categories = await Category.findAll({
               where: {
                    type: 'Thể thao',
               },
               attributes: ['id', 'name'],
          })

          const result = []

          // Tính tỉ lệ sử dụng cho từng danh mục
          for (const category of categories) {
               // Lấy danh sách sân thuộc danh mục
               const courts = await Court.findAll({
                    where: { category_id: category.id },
                    attributes: ['id'],
               })

               const courtIds = courts.map((court) => court.id)

               if (courtIds.length === 0) {
                    // Nếu không có sân trong danh mục này
                    result.push({
                         name: category.dataValues.name,
                         utilization: 0,
                    })
                    continue
               }

               // Tổng số slot
               const totalSlots = await TimeSlot.count({
                    where: {
                         court_id: { [Op.in]: courtIds },
                         date: { [Op.between]: [startDate, endDate] },
                    },
               })

               // Số slot đã đặt
               const bookedSlots = await TimeSlot.count({
                    where: {
                         court_id: { [Op.in]: courtIds },
                         date: { [Op.between]: [startDate, endDate] },
                         is_booked: true,
                    },
               })

               // Tính tỉ lệ sử dụng
               const utilization = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0

               result.push({
                    name: category.dataValues.name,
                    utilization,
               })
          }

          // Sắp xếp theo tỉ lệ sử dụng từ cao xuống thấp
          const sortedResult = result.sort((a, b) => b.utilization - a.utilization)

          return res.status(200).json({
               statusCode: 200,
               success: true,
               message: 'Success',
               data: sortedResult,
          })
     } catch (error) {
          console.error('Error fetching court utilization by category:', error)
          return res.status(500).json({
               statusCode: 500,
               success: false,
               message: 'Internal server error',
               error,
          })
     }
}
