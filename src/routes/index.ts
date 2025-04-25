import express from 'express'
import { register } from './auth/register'
import { login } from './auth/login'
import uploadFile from '../common/functions/uploadFiles'
import { forgotPass } from './auth/forgot'
import { verifyOtp } from './auth/verify'
import { changePass } from './auth/change'
import { logout } from './auth/logout'
import { getMe } from './users/getMe'
import { authenticateToken } from '../common/functions/checkToken'
import { updateMe } from './users/updateMe'
import { resetPass } from './users/resetPass'
import { Server } from 'socket.io'
import { getAuth } from './users/getAuth'
import { getBookings } from './bookings/get'

const router = express.Router()

export const apiRoutes = (io: Server) => {
     router.get('/', (req, res) => {
          return res.send('Hello world!')
     })

     /* --------------- AUTH --------------- */
     router.post('/auth/register', register)
     router.post('/auth/login', login)
     router.post('/auth/forgot-pass', forgotPass)
     router.post('/auth/verify-otp', verifyOtp)
     router.post('/auth/change-pass', changePass)

     // router.use(authenticateToken)
     router.post('/auth/logout', logout)

     /* --------------- USERS --------------- */
     router.get('/users/me', getMe)
     router.get('/users/auth', getAuth)
     router.put('/users/me', uploadFile('temp').single('avatar'), updateMe)
     router.post('/users/change-pass', resetPass)
     // router.delete('/users/:userId', deleteUser)

     router.get('/bookings', getBookings)

     return router;
}
export default apiRoutes
