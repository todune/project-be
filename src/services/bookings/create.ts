import ServiceOrder from '@models/service-order.model'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import Booking from '@models/booking.model'
import { Request, Response } from 'express'
import Product from '@models/product.model'
import User from '@models/user.model'
import Role from '@models/role.model'
import db from '@configs/db.config'
import { Op } from 'sequelize'
import { z } from 'zod'
import Court from '@models/court.model'
import logger from '@common/logger'

export const createBookingSchema = z
     .object({
          court_id: z.number({ required_error: 'ID sân không được để trống' }),
          user_id: z
               .number()
               .int()
               .positive('ID người dùng phải là số nguyên dương')
               .nullable()
               .optional(),

          full_name: z.string().min(1, 'Tên không được để trống').optional(),
          phone_number: z.string().min(10, 'Số điện thoại không hợp lệ').optional(),
          email: z.string().email('Email không hợp lệ').optional(),

          time_slot_id: z
               .number({ required_error: 'Khung giờ đặt không được để trống' })
               .int()
               .positive('ID khung giờ phải là số nguyên dương'),

          notes: z.string().optional().nullable(),

          service_orders: z
               .array(
                    z.object({
                         product_id: z
                              .number()
                              .int()
                              .positive('ID sản phẩm phải là số nguyên dương')
                              .optional(),
                         quantity: z
                              .number({ required_error: 'Số lượng không được để trống' })
                              .int()
                              .positive('Số lượng phải là số nguyên dương'),
                    })
               )
               .optional(),
     })
     .refine(
          (data) => {
               // Custom validation: nếu user_id không có, thì full_name, phone_number, email phải có
               if (!data.user_id) {
                    return !!data.full_name && !!data.phone_number && !!data.email
               }
               return true
          },
          {
               message: 'Thông tin người dùng (tên, số điện thoại, email) là bắt buộc nếu không cung cấp ID người dùng',
               path: ['user_id'], // Gắn lỗi vào trường user_id
          }
     )

export type CreateBookingInput = z.infer<typeof createBookingSchema>

export const createBooking = async (req: Request, res: Response) => {
     const transaction = await db.transaction()
     try {
          const {
               user_id,
               full_name,
               phone_number,
               email,
               time_slot_id,
               notes,
               service_orders,
               court_id,
          } = req.body as CreateBookingInput

          // 1. Kiểm tra sân tồn tại
          const isCourtExist = await Court.findByPk(court_id, { transaction })
          if (!isCourtExist) throw new ApiError('Sân không tồn tại', 404)

          // 2. Kiểm tra khung giờ tồn tại
          const isTimeSlotExist = await TimeSlot.findByPk(time_slot_id, { transaction })
          if (!isTimeSlotExist) throw new ApiError('Khung giờ đặt không tồn tại', 404)

          // 3. Xử lý Người dùng (Đã đăng nhập hoặc Khách)
          let userId = user_id
          if (!userId) {
               // user is guest
               const existingGuestUser = await User.findOne({
                    where: {
                         [Op.or]: [{ email: email }, { phone_number: phone_number }],
                    },
                    transaction,
               })

               if (existingGuestUser) {
                    userId = existingGuestUser.id
               } else {
                    const role = await Role.findOne({ where: { name: 'Người dùng' }, transaction })
                    if (!role)
                         throw new ApiError('Vai trò khách hàng không tồn tại trong hệ thống', 404)
                    const guestUser = await User.create(
                         {
                              full_name,
                              phone_number,
                              email,
                              role_id: role.id,
                         },
                         { transaction }
                    )
                    userId = guestUser.id
               }
          } else {
               const existingUser = await User.findByPk(userId, { transaction })
               if (!existingUser) throw new ApiError('ID người dùng không tồn tại', 404)
          }

          // 4. Tính toán Giá
          logger.info('cal price')
          let totalPrice = parseFloat(isTimeSlotExist.price)

          // 5. Xử lý Service Orders (nếu có)
          const createdServiceOrders = []
          if (service_orders && service_orders.length > 0) {
               for (const order of service_orders) {
                    let itemPrice = 0
                    let itemId = null

                    if (order.product_id) {
                         const productItem = await Product.findByPk(order.product_id, {
                              transaction,
                         })
                         if (!productItem) {
                              throw new ApiError(
                                   `Món ăn với ID ${order.product_id} không tồn tại`,
                                   404
                              )
                         }
                         itemPrice = parseFloat(productItem.price.toString())
                         itemId = productItem.id
                    } else {
                         throw new ApiError('Mục đặt dịch vụ không hợp lệ', 400)
                    }

                    const orderPrice = itemPrice * order.quantity
                    totalPrice += orderPrice // Cộng dồn vào tổng tiền

                    // Tạo bản ghi ServiceOrder
                    const newServiceOrder = await ServiceOrder.create(
                         {
                              product_id: itemId,
                              quantity: order.quantity,
                              price: orderPrice, // Giá cho mục dịch vụ này (số lượng * đơn giá)
                         },
                         { transaction }
                    )
                    createdServiceOrders.push(newServiceOrder)
               }
          }

          // 6. Tạo Booking
          logger.info('create booking')
          const newBooking = await Booking.create(
               {
                    user_id: userId,
                    court_id,
                    time_slot_id,
                    price_at_booking: isTimeSlotExist.price, // Giá sân đã tính
                    total_price: totalPrice, // Tổng tiền (sân + dịch vụ)
                    status: 'Mới',
                    notes,
               },
               { transaction }
          )

          // 7. Cập nhật booking_id cho các ServiceOrder đã tạo
          for (const so of createdServiceOrders) {
               await so.update({ booking_id: newBooking.id }, { transaction })
          }

          await transaction.commit()

          sendJson(
               res,
               { id: newBooking.time_slot_id, user_id: userId },
               'Đặt sân thành công. Vui lòng hoàn tất thanh toán.'
          )
     } catch (e) {
          await transaction.rollback()
          throw e
     }
}
