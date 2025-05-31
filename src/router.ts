import express from 'express'
import { requestMiddleware } from '@common/middleware/requestMiddleware'
import { validateMiddleware } from '@common/middleware/validateMiddleware'
import { uploadFileMiddleware } from '@common/middleware/uploadMiddleware'
import { UploadType } from '@common/interface'
import { getMe } from '@services/auth/getMe'
import { login, loginSchema } from '@services/auth/login'
import { logout } from '@services/auth/logout'
import { authenticateToken } from '@common/utils/tokenUtils'
import { getCategories } from '@services/categories/get'
import { createCategory, createCategorySchema } from '@services/categories/create'
import { updateCategory, updateCategorySchema } from '@services/categories/update'
import { deleteCategory } from '@services/categories/delete'
import { getTimeSlots } from '@services/time-slots/get'
import { createTimeSlot, createTimeSlotSchema } from '@services/time-slots/create'
import { updateTimeSlot, updateTimeSlotSchema } from '@services/time-slots/update'
import { deleteTimeSlot } from '@services/time-slots/delete'
import { getRoles } from '@services/roles/get'
import { createRole, createRoleSchema } from '@services/roles/create'
import { updateRole, updateRoleSchema } from '@services/roles/update'
import { deleteRole } from '@services/roles/delete'
import { getUsers } from '@services/users/get'
import { createUser, createUserSchema } from '@services/users/create'
import { updateUser, updateUserSchema } from '@services/users/update'
import { deleteUser } from '@services/users/delete'
import { getCourts } from '@services/courts/get'
import { createCourt, createCourtSchema } from '@services/courts/create'
import { updateCourt, updateCourtSchema } from '@services/courts/update'
import { deleteCourt } from '@services/courts/delete'
import { getCourtById } from '@services/courts/getById'
import { createBooking, createBookingSchema } from '@services/bookings/create'
import { confirmPayment } from '@services/bookings/confirm-payment'
import { createTransaction, createTransactionSchema } from '@services/transactions/create'
import { getTransactions } from '@services/transactions/get'
import { getBookings } from '@services/bookings/get'
import { getCourtsByCus } from '@services/courts/getByCus'
import { getProducts } from '@services/products/get'
import { createProduct, createProductSchema } from '@services/products/create'
import { updateProduct, updateProductSchema } from '@services/products/update'
import { deleteProduct } from '@services/products/delete'
import { permMiddleware } from '@common/middleware/permisisonMiddleware'
import { getPermissions } from '@services/permissions/get'
import { setPermission, setPermissionSchema } from '@services/permissions/set-perm'
import { changePass, changePassSchema } from '@services/users/change-pass'
import { getTimeSlotById } from '@services/time-slots/getById'
import { getBookingById } from '@services/bookings/getById'
import { getSportCenterById } from '@services/sport-centers/get'
import { updateSportCenter, updateSportCenterSchema } from '@services/sport-centers/update'
import { getDashboardStats } from '@services/reports/getDashboardStats'
import { getMonthlyRevenue } from '@services/reports/getMonthlyRevenue'
import { getWeeklyBookings } from '@services/reports/getWeeklyBookings'
import { getSportsDistribution } from '@services/reports/getSportsDistribution'
import { getCourtUtilization } from '@services/reports/getCourtUtilization'
import { getUpcomingBookings } from '@services/reports/getUpcomingBookings'
import { getTopBookedCourts } from '@services/courts/getTopBookedCourts'
import { refundBooking } from '@services/bookings/refund'
import { getDailyStats } from '@services/reports/getDailyStats'

const router = express.Router()

const apiRoutes = () => {
     router.get('/health', (req, res) => {
          return res.send('Healthy!')
     })

     router.post('/upload', uploadFileMiddleware(UploadType.FILE), (req, res) => {
          res.status(200).json(res.locals.uploadedUrls)
     })

     // middlewares
     router.use(requestMiddleware)

     // login
     router.post('/auth/login', validateMiddleware(loginSchema), login)

     // get by customer
     router.get('/courts/cus', getCourtsByCus)

     router.get('/sport-centers/:id', getSportCenterById)

     // bookings
     router.post('/bookings', validateMiddleware(createBookingSchema), createBooking)
     router.get('/bookings/popular', getTopBookedCourts)
     router.post('/bookings/:id/confirm-payment', confirmPayment)
     router.get('/courts/:id', getCourtById)
     router.get('/time-slots/:id', getTimeSlotById)

     // bookings
     router.post('/transactions', validateMiddleware(createTransactionSchema), createTransaction)

     router.get('/categories', getCategories)
     router.get('/products', getProducts)

     // auth
     router.use(authenticateToken)
     router.get('/auth/me', getMe)
     router.post('/auth/logout', logout)

     router.post('/bookings/refund/:id', refundBooking)

     // sport center
     router.put(
          '/sport-centers/:id',
          permMiddleware('Cập nhật thông tin'),
          validateMiddleware(updateSportCenterSchema),
          updateSportCenter
     )

     // transactions
     router.get('/transactions', permMiddleware('Theo dõi giao dịch'), getTransactions)

     // bookings
     router.get('/bookings', permMiddleware('Theo dõi sân'), getBookings)
     router.get('/bookings/:id', permMiddleware('Theo dõi sân'), getBookingById)

     // categories
     router.post(
          '/categories',
          permMiddleware('Thêm danh mục'),
          validateMiddleware(createCategorySchema),
          createCategory
     )
     router.put(
          '/categories/:id',
          permMiddleware('Sửa danh mục'),
          validateMiddleware(updateCategorySchema),
          updateCategory
     )
     router.delete('/categories/:id', permMiddleware('Xóa danh mục'), deleteCategory)

     // slots
     router.get('/time-slots', getTimeSlots)
     router.post(
          '/time-slots',
          permMiddleware('Tạo lịch'),
          validateMiddleware(createTimeSlotSchema),
          createTimeSlot
     )
     router.put(
          '/time-slots/:id',
          permMiddleware('Tạo lịch'),
          validateMiddleware(updateTimeSlotSchema),
          updateTimeSlot
     )
     router.delete('/time-slots/:id', deleteTimeSlot)

     // roles
     router.get('/roles', permMiddleware('Phân quyền'), getRoles)
     router.post(
          '/roles',
          permMiddleware('Phân quyền'),
          validateMiddleware(createRoleSchema),
          createRole
     )
     router.put(
          '/roles/:id',
          permMiddleware('Phân quyền'),
          validateMiddleware(updateRoleSchema),
          updateRole
     )
     router.delete('/roles/:id', permMiddleware('Phân quyền'), deleteRole)

     // products
     router.post(
          '/products',
          permMiddleware('Thêm sản phẩm'),
          validateMiddleware(createProductSchema),
          createProduct
     )
     router.put(
          '/products/:id',
          permMiddleware('Sửa sản phẩm'),
          validateMiddleware(updateProductSchema),
          updateProduct
     )
     router.delete('/products/:id', permMiddleware('Xóa sản phẩm'), deleteProduct)

     // users
     router.get('/users', permMiddleware('Xem người dùng'), getUsers)
     router.post(
          '/users',
          permMiddleware('Thêm người dùng'),
          validateMiddleware(createUserSchema),
          createUser
     )
     router.post('/users/change-pass', validateMiddleware(changePassSchema), changePass)
     router.put(
          '/users/:id',
          permMiddleware('Sửa người dùng'),
          validateMiddleware(updateUserSchema),
          updateUser
     )
     router.delete('/users/:id', permMiddleware('Xóa người dùng'), deleteUser)

     // courts
     router.get('/courts', permMiddleware('Xem sân'), getCourts)
     router.post(
          '/courts',
          permMiddleware('Thêm sân'),
          validateMiddleware(createCourtSchema),
          createCourt
     )
     router.put(
          '/courts/:id',
          permMiddleware('Sửa sân'),
          validateMiddleware(updateCourtSchema),
          updateCourt
     )
     router.delete('/courts/:id', permMiddleware('Xóa sân'), deleteCourt)

     // permissions
     router.get('/permissions/:id', permMiddleware('Phân quyền'), getPermissions)
     router.post(
          '/permissions',
          permMiddleware('Phân quyền'),
          validateMiddleware(setPermissionSchema),
          setPermission
     )

     // reports
     // router.get('/reports/revenue/summary', permMiddleware('Xem báo cáo'), getRevenueSummary)
     // router.get('/reports/bookings/status', permMiddleware('Xem báo cáo'), getBookingStatus)
     // router.get('/reports/courts/performance', permMiddleware('Xem báo cáo'), getCourtPerformance)
     // router.get(
     //      '/reports/products/top-selling',
     //      permMiddleware('Xem báo cáo'),
     //      getProductTopSelling
     // )
     router.get('/reports/stats', permMiddleware('Xem báo cáo'), getDashboardStats)
     router.get('/reports/daily', permMiddleware('Xem báo cáo'), getDailyStats)
     router.get('/reports/monthly-revenue', permMiddleware('Xem báo cáo'), getMonthlyRevenue)
     router.get('/reports/weekly-bookings', permMiddleware('Xem báo cáo'), getWeeklyBookings)
     router.get(
          '/reports/sports-distribution',
          permMiddleware('Xem báo cáo'),
          getSportsDistribution
     )
     router.get('/reports/court-utilization', permMiddleware('Xem báo cáo'), getCourtUtilization)
     router.get('/reports/upcoming-bookings', permMiddleware('Xem báo cáo'), getUpcomingBookings)

     return router
}

export default apiRoutes
