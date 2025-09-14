import express from 'express'
const userRouter = express.Router()
import {register , login , me , refreshToken} from '../controllers/user.controller'
import {authenticate} from '../middleware/auth'

userRouter.post('/register' , register);
userRouter.post('/login' , login);
userRouter.get('/me' ,authenticate, me)
userRouter.post('/refresh' ,authenticate, refreshToken)

export default userRouter