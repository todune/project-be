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
import { getSlots } from '@services/slots/get'
import { createSlot, createSlotSchema } from '@services/slots/create'
import { updateSlot, updateSlotSchema } from '@services/slots/update'
import { deleteSlot } from '@services/slots/delete'
import { getFoodItems } from '@services/food-items/get'
import { createFoodItem, createFoodItemSchema } from '@services/food-items/create'
import { updateFoodItem, updateFoodItemSchema } from '@services/food-items/update'
import { deleteFoodItem } from '@services/food-items/delete'
import { getEquipmentItems } from '@services/equipment-items/get'
import { createEquipmentItem, createEquipmentItemSchema } from '@services/equipment-items/create'
import { updateEquipmentItem, updateEquipmentItemSchema } from '@services/equipment-items/update'
import { deleteEquipmentItem } from '@services/equipment-items/delete'
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

     // auth
     router.post('/auth/login', validateMiddleware(loginSchema), login)

     router.use(authenticateToken)
     router.get('/auth/me', getMe)
     router.post('/auth/logout', logout)

     // categories
     router.get('/categories', getCategories)
     router.post('/categories', validateMiddleware(createCategorySchema), createCategory)
     router.put('/categories/:id', validateMiddleware(updateCategorySchema), updateCategory)
     router.delete('/categories/:id', deleteCategory)

     // slots
     router.get('/slots', getSlots)
     router.post('/slots', validateMiddleware(createSlotSchema), createSlot)
     router.put('/slots/:id', validateMiddleware(updateSlotSchema), updateSlot)
     router.delete('/slots/:id', deleteSlot)

     // roles
     router.get('/roles', getRoles)
     router.post('/roles', validateMiddleware(createRoleSchema), createRole)
     router.put('/roles/:id', validateMiddleware(updateRoleSchema), updateRole)
     router.delete('/roles/:id', deleteRole)

     // food items
     router.get('/food-items', getFoodItems)
     router.post('/food-items', validateMiddleware(createFoodItemSchema), createFoodItem)
     router.put('/food-items/:id', validateMiddleware(updateFoodItemSchema), updateFoodItem)
     router.delete('/food-items/:id', deleteFoodItem)

     // equipment items
     router.get('/equipment-items', getEquipmentItems)
     router.post(
          '/equipment-items',
          validateMiddleware(createEquipmentItemSchema),
          createEquipmentItem
     )
     router.put(
          '/equipment-items/:id',
          validateMiddleware(updateEquipmentItemSchema),
          updateEquipmentItem
     )
     router.delete('/equipment-items/:id', deleteEquipmentItem)

     // users
     router.get('/users', getUsers)
     router.post('/users', validateMiddleware(createUserSchema), createUser)
     router.put('/users/:id', validateMiddleware(updateUserSchema), updateUser)
     router.delete('/users/:id', deleteUser)

     // courts
     router.get('/courts', getCourts)
     router.post('/courts', validateMiddleware(createCourtSchema), createCourt)
     router.put('/courts/:id', validateMiddleware(updateCourtSchema), updateCourt)
     router.delete('/courts/:id', deleteCourt)

     // schedules
     router.get('/schedules', getCourts)
     router.post('/schedules', validateMiddleware(createCourtSchema), createCourt)
     router.put('/schedules/:id', validateMiddleware(updateCourtSchema), updateCourt)
     router.delete('/schedules/:id', deleteCourt)

     return router
}

export default apiRoutes
