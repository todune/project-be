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
import { getRevenueSummary } from '@services/reports/getRevenueSummary'
import { getBookingStatus } from '@services/reports/getBookingStatus'
import { getCourtPerformance } from '@services/reports/getCourtPerformance'
import { getProductTopSelling } from '@services/reports/getProductTopSelling'

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

     // bookings
     router.post('/bookings', validateMiddleware(createBookingSchema), createBooking)
     router.post('/bookings/:id/confirm-payment', confirmPayment)

     // bookings
     router.post('/transactions', validateMiddleware(createTransactionSchema), createTransaction)

     // auth
     router.use(authenticateToken)
     router.get('/auth/me', getMe)
     router.post('/auth/logout', logout)

     // transactions
     router.get('/transactions', permMiddleware('Theo dõi giao dịch'), getTransactions)

     // bookings
     router.get('/bookings', permMiddleware('Theo dõi sân'), getBookings)

     // categories
     router.get('/categories', permMiddleware('Xem danh mục'), getCategories)
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
     router.get('/products', permMiddleware('Xem sản phẩm'), getProducts)
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
     router.put(
          '/users/:id',
          permMiddleware('Sửa người dùng'),
          validateMiddleware(updateUserSchema),
          updateUser
     )
     router.delete('/users/:id', permMiddleware('Xóa người dùng'), deleteUser)

     // courts
     router.get('/courts', permMiddleware('Xem sân'), getCourts)
     router.get('/courts/:id', permMiddleware('Xem sân'), getCourtById)
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
     router.get('/reports/revenue/summary', permMiddleware('Xem báo cáo'), getRevenueSummary)
     router.get('/reports/bookings/status', permMiddleware('Xem báo cáo'), getBookingStatus)
     router.get('/reports/courts/performance', permMiddleware('Xem báo cáo'), getCourtPerformance)
     router.get(
          '/reports/products/top-selling',
          permMiddleware('Xem báo cáo'),
          getProductTopSelling
     )

     return router
}

export default apiRoutes
