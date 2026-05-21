import express from 'express'
import { signin,signup,logout } from '../controllers/authController'

const router = express.Router()

router.post('/signin',signin)


export default router


