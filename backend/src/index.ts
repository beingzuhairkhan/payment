import 'dotenv/config'; 
import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler'
import connectDB from './config/db'
import userRouter from './routes/user.route'
import schoolRouter from './routes/school.route'
import orderRouter from './routes/order.route'
import transactionRouter from './routes/transaction.route'


const app = express()
const PORT = process.env.PORT;

connectDB();
app.use(cors({
  origin:[process.env.FRONTEND_URL!],
  credentials: true
}));
app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

//Route
app.use('/api/auth', userRouter)
app.use('/api/school', schoolRouter)
app.use('/api/order', orderRouter)
app.use('/api/transaction', transactionRouter)
// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'School Payment Dashboard API is running',
    timeStamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
