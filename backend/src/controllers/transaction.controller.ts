import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Order from '../models/order.model'
import School from '../models/school.model'
import OrderStatus from '../models/orderStatus.model'

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        let {
            page = 1,
            limit = 10,
            sort = 'payment_time',
            order = 'desc',
            ['status[]']: status,
            school_id,
            gateway,
            from_date,
            to_date,
            search,
        } = req.query

        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        const matchCondition: any = {}
        if (status) {
            matchCondition['orderStatus.status'] = Array.isArray(status)
                ? { $in: status }
                : status
        }

        if (school_id) {
            matchCondition['school_id'] = Array.isArray(school_id)
                ? { $in: (school_id as string[]).map(id => new mongoose.Types.ObjectId(id)) }
                : new mongoose.Types.ObjectId(school_id as string)
        }

        if (gateway) {
            matchCondition['payment_mode'] = Array.isArray(gateway)
                ? { $in: gateway }
                : gateway
        }

        if (from_date || to_date) {
            matchCondition['orderStatus.payment_time'] = {}
            if (from_date) {
                matchCondition['orderStatus.payment_time'].$gte = new Date(from_date as string)
            }
            if (to_date) {
                matchCondition['orderStatus.payment_time'].$lte = new Date(to_date as string)
            }
        }

        if (search) {
            matchCondition.$or = [
                { 'student_info.name': { $regex: search, $options: 'i' } },
                { 'student_info.email': { $regex: search, $options: 'i' } },
                { 'school.name': { $regex: search, $options: 'i' } },
                { custom_order_id: { $regex: search, $options: 'i' } },
                { 'orderStatus.bank_reference': { $regex: search, $options: 'i' } },
            ]
        }

        const sortObj: any = {}
        const sortField = (sort as string).includes('.') ? sort : `orderStatus.${sort}`
        sortObj[sortField as string] = order === 'desc' ? -1 : 1

        // Aggregation pipeline
        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'orderstatuses',
                    localField: '_id',
                    foreignField: 'collect_id',
                    as: 'orderStatus',
                },
            },
            {
                $unwind: {
                    path: '$orderStatus',
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: 'schools',
                    localField: 'school_id',
                    foreignField: '_id',
                    as: 'school',
                },
            },
            {
                $unwind: {
                    path: '$school',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: matchCondition,
            },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    school_name: '$school.name',
                    gateway: '$gateway_name',
                    order_amount: '$orderStatus.order_amount',
                    transaction_amount: '$orderStatus.transaction_amount',
                    status: '$orderStatus.status',
                    custom_order_id: 1,
                    payment_time: '$orderStatus.payment_time',
                    payment_mode: '$orderStatus.payment_mode',
                    bank_reference: '$orderStatus.bank_reference',
                    payment_message: '$orderStatus.payment_message',
                    student_info: 1,
                    error_message: '$orderStatus.error_message',
                },
            },
            {
                $sort: sortObj,
            },
        ]

        const countPipeline = [...pipeline, { $count: 'total' }]
        const countResult = await Order.aggregate(countPipeline)
        const total = countResult.length > 0 ? countResult[0].total : 0

        pipeline.push({ $skip: skip }, { $limit: limitNum })

        const transactions = await Order.aggregate(pipeline)
        // console.log(transactions)
        res.json({
            status: 'success',
            data: {
                transactions,
                pagination: {
                    current_page: pageNum,
                    total_pages: Math.ceil(total / limitNum),
                    total_count: total,
                    per_page: limitNum,
                    has_next: pageNum < Math.ceil(total / limitNum),
                    has_prev: pageNum > 1,
                },
            },
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch transactions',
        })
    }
}


export const transactionStatusByOrderId = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;

        if (!order_id) {
            return res.status(400).json({ success: false, message: "order_id is required" });
        }

        const order = await Order.findOne({ custom_order_id: order_id });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order does not exist" });
        }

        const orderStatus = await OrderStatus.findOne({ collect_id: order._id });

        if (!orderStatus) {
            return res.status(404).json({ success: false, message: "Order status does not exist" });
        }

        // Combine order and orderStatus into a single object
        const combinedData = {
            id: order._id,
            custom_order_id: order.custom_order_id,
            gateway_name: order.gateway_name,
            student_info: order.student_info,
            school_id: order.school_id,
            created_at: order.createdAt,
            ...orderStatus.toObject(),
        };

        return res.status(200).json({
            success: true,
            data: combinedData,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transaction status",
            error: error.message || error,
        });
    }
};


export const getTransactionBySchoolId = async (req: Request, res: Response) => {
    try {
        const { schoolId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        if (!mongoose.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid school ID format'
            });
        }

        const matchConditions: any = {
            school_id: new mongoose.Types.ObjectId(schoolId)
        };

        if (status) {
            matchConditions['orderStatus.status'] = status;
        }

        // Sort descending by payment_time
        const sortObj = { "orderStatus.payment_time": -1 };

        const pipeline = [
            { $match: { school_id: new mongoose.Types.ObjectId(schoolId) } },
            {
                $lookup: {
                    from: 'orderstatuses',
                    localField: '_id',
                    foreignField: 'collect_id',
                    as: 'orderStatus'
                }
            },
            { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: false } },
            { $match: matchConditions },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    gateway: '$gateway_name',
                    order_amount: '$orderStatus.order_amount',
                    transaction_amount: '$orderStatus.transaction_amount',
                    status: '$orderStatus.status',
                    custom_order_id: 1,
                    payment_time: '$orderStatus.payment_time',
                    payment_mode: '$orderStatus.payment_mode',
                    bank_reference: '$orderStatus.bank_reference',
                    payment_message: '$orderStatus.payment_message',
                    student_info: 1,
                    error_message: '$orderStatus.error_message'
                }
            },
            { $sort: sortObj }
        ];

        // Count total records
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await Order.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Add pagination
        pipeline.push({ $skip: skip }, { $limit: limitNum });

        // Execute aggregation
        const transactions = await Order.aggregate(pipeline);

        res.json({
            status: 'success',
            data: {
                school_id: schoolId,
                transactions,
                pagination: {
                    current_page: pageNum,
                    total_pages: Math.ceil(total / limitNum),
                    total_count: total,
                    per_page: limitNum
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: "Failed to fetch transaction status",
        });
    }
};


export const dashboardData = async (req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$status", // success / pending / failed
          totalTransaction: { $sum: 1 },
          totalAmount: { $sum: "$transaction_amount" },
        },
      },
    ];

    const stats = await OrderStatus.aggregate(pipeline);

    // Initialize counters
    let totalTransaction = 0;
    let totalAmount = 0;
    let totalSuccessful = 0;
    let totalPending = 0;
    let totalFailed = 0;

    stats.forEach((row) => {
      if(row._id === "success"){
          totalAmount += row.totalAmount;
        }
        totalTransaction += row.totalTransaction;

      if (row._id === "success") totalSuccessful = row.totalTransaction;
      if (row._id === "pending") totalPending = row.totalTransaction;
      if (row._id === "failed") totalFailed = row.totalTransaction;
    });

    return res.json({
      status: "success",
      data: {
        totalTransaction,
        totalAmount,
        totalSuccessful,
        totalPending,
        totalFailed,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard data",
    });
  }
};