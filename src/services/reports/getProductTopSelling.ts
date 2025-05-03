import { getDateRangeCondition } from '@common/utils/getDateRangeCondition'
import Booking from '@models/booking.model'
import Product from '@models/product.model'
import ServiceOrder from '@models/service-order.model'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize'

export const getProductTopSelling = async (req: Request, res: Response) => {
     const { startDate, endDate, limit } = req.query as {
          startDate?: string
          endDate?: string
          limit?: string
     }
     const dateCondition = getDateRangeCondition(startDate, endDate)

     const bookingWhereClause: any = { status: 'Đã thanh toán' }
     if (dateCondition) {
          bookingWhereClause.created_at = dateCondition
     }

     const topProducts: any[] = (await ServiceOrder.findAll({
          attributes: [
               [Sequelize.fn('SUM', Sequelize.col('ServiceOrder.quantity')), 'totalQuantitySold'],
               [
                    Sequelize.fn('SUM', Sequelize.col('ServiceOrder.price')),
                    'totalRevenueFromProduct',
               ],
          ],
          include: [
               {
                    model: Product,
                    as: 'productData', // Sử dụng alias
                    attributes: ['id', 'name', 'type'],
               },
               {
                    model: Booking,
                    as: 'bookingOrderData', // Sử dụng alias
                    attributes: [], // Không cần lấy attribute nào từ Booking, chỉ dùng để lọc
                    where: bookingWhereClause,
               },
          ],
          group: ['product_id', 'productData.id', 'bookingOrderData.id'], // Group theo product_id và các primary key của các model được include
          order: [[Sequelize.literal('"totalQuantitySold"'), 'DESC']], // Sắp xếp theo cột tính toán totalQuantitySold
          limit: limit ? parseInt(limit, 10) : undefined, // Parse limit từ string sang number
          raw: true,
     })) as any[] // Type assertion cho kết quả raw

     const formattedTopProducts = topProducts.map((item) => ({
          productId: item.product_id,
          productName: item['productData.name'],
          productType: item['productData.type'],
          totalQuantitySold: parseInt(item.totalQuantitySold, 10),
          totalRevenue: parseFloat(item.totalRevenueFromProduct),
     }))

     return res.status(200).json({
          statusCode: 200,
          success: true,
          message: 'Success',
          data: formattedTopProducts,
     })
}
