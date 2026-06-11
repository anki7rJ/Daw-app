import express from 'express'
import { signin,signup,logout } from '../controllers/authController'

const router:express.Router = express.Router()

router.post('/signin',signin)
router.post('/signup',signup)
router.post('/logout',logout)


export default router


