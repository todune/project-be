import { Op } from 'sequelize'

export const getDateRangeCondition = (
     startDate?: string,
     endDate?: string
): { [Op.gte]?: Date; [Op.lte]?: Date } | null => {
     const condition: { [Op.gte]?: Date; [Op.lte]?: Date } = {}
     if (startDate) {
          const start = new Date(startDate)
          start.setHours(0, 0, 0, 0) // Bắt đầu ngày
          condition[Op.gte] = start
     }
     if (endDate) {
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999) // Kết thúc ngày
          condition[Op.lte] = end
     }
     if (Object.keys(condition).length > 0) {
          return condition
     }
     return null // Không có điều kiện ngày nào được cung cấp
}
