import express from 'express'
const transactionRouter = express.Router()
import {getAllTransactions , transactionStatusByOrderId , getTransactionBySchoolId , dashboardData} from '../controllers/transaction.controller'
import {authenticate} from '../middleware/auth'



transactionRouter.get('/' ,authenticate, getAllTransactions)
transactionRouter.get('/status/:order_id',authenticate, transactionStatusByOrderId);
transactionRouter.get('/school/:schoolId'  ,authenticate, getTransactionBySchoolId)
transactionRouter.get('/overview' , authenticate , dashboardData)

export default transactionRouter