import express from 'express'
const orderRouter = express.Router()
import {createPayment , verifyPayment} from '../controllers/order.controller'
import {authenticate} from '../middleware/auth'


orderRouter.post('/create-payment' , authenticate , createPayment);
orderRouter.get("/verify-payment", verifyPayment);

export default orderRouter ;