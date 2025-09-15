"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardData = exports.getTransactionBySchoolId = exports.transactionStatusByOrderId = exports.getAllTransactions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = __importDefault(require("../models/order.model"));
const orderStatus_model_1 = __importDefault(require("../models/orderStatus.model"));
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page = 1, limit = 10, sort = 'payment_time', order = 'desc', ['status[]']: status, school_id, gateway, from_date, to_date, search, } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const matchCondition = {};
        if (status) {
            matchCondition['orderStatus.status'] = Array.isArray(status)
                ? { $in: status }
                : status;
        }
        if (school_id) {
            matchCondition['school_id'] = Array.isArray(school_id)
                ? { $in: school_id.map(id => new mongoose_1.default.Types.ObjectId(id)) }
                : new mongoose_1.default.Types.ObjectId(school_id);
        }
        if (gateway) {
            matchCondition['payment_mode'] = Array.isArray(gateway)
                ? { $in: gateway }
                : gateway;
        }
        if (from_date || to_date) {
            matchCondition['orderStatus.payment_time'] = {};
            if (from_date) {
                matchCondition['orderStatus.payment_time'].$gte = new Date(from_date);
            }
            if (to_date) {
                matchCondition['orderStatus.payment_time'].$lte = new Date(to_date);
            }
        }
        if (search) {
            matchCondition.$or = [
                { 'student_info.name': { $regex: search, $options: 'i' } },
                { 'student_info.email': { $regex: search, $options: 'i' } },
                { 'school.name': { $regex: search, $options: 'i' } },
                { custom_order_id: { $regex: search, $options: 'i' } },
                { 'orderStatus.bank_reference': { $regex: search, $options: 'i' } },
            ];
        }
        const sortObj = {};
        const sortField = sort || 'payment_time';
        sortObj[sortField] = (order === null || order === void 0 ? void 0 : order.toLowerCase()) === 'desc' ? -1 : 1;
        const pipeline = [
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
        ];
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = yield order_model_1.default.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        pipeline.push({ $skip: skip }, { $limit: limitNum });
        const transactions = yield order_model_1.default.aggregate(pipeline);
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
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch transactions',
        });
    }
});
exports.getAllTransactions = getAllTransactions;
const transactionStatusByOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.params;
        if (!order_id) {
            return res.status(400).json({ success: false, message: "order_id is required" });
        }
        const order = yield order_model_1.default.findOne({ custom_order_id: order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order does not exist" });
        }
        const orderStatus = yield orderStatus_model_1.default.findOne({ collect_id: order._id });
        if (!orderStatus) {
            return res.status(404).json({ success: false, message: "Order status does not exist" });
        }
        const combinedData = Object.assign({ id: order._id, custom_order_id: order.custom_order_id, gateway_name: order.gateway_name, student_info: order.student_info, school_id: order.school_id, created_at: order.createdAt }, orderStatus.toObject());
        return res.status(200).json({
            success: true,
            data: combinedData,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transaction status",
            error: error.message || error,
        });
    }
});
exports.transactionStatusByOrderId = transactionStatusByOrderId;
const getTransactionBySchoolId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { schoolId } = req.params;
        const { page = 1, limit = 10, status } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        if (!mongoose_1.default.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid school ID format'
            });
        }
        const matchConditions = {
            school_id: new mongoose_1.default.Types.ObjectId(schoolId)
        };
        if (status) {
            matchConditions['orderStatus.status'] = status;
        }
        const sortObj = { "orderStatus.payment_time": -1 };
        const pipeline = [
            { $match: { school_id: new mongoose_1.default.Types.ObjectId(schoolId) } },
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
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = yield order_model_1.default.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        pipeline.push({ $skip: skip }, { $limit: limitNum });
        const transactions = yield order_model_1.default.aggregate(pipeline);
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
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: "Failed to fetch transaction status",
        });
    }
});
exports.getTransactionBySchoolId = getTransactionBySchoolId;
const dashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
            {
                $group: {
                    _id: "$status",
                    totalTransaction: { $sum: 1 },
                    totalAmount: { $sum: "$transaction_amount" },
                },
            },
        ];
        const stats = yield orderStatus_model_1.default.aggregate(pipeline);
        // Initialize counters
        let totalTransaction = 0;
        let totalAmount = 0;
        let totalSuccessful = 0;
        let totalPending = 0;
        let totalFailed = 0;
        stats.forEach((row) => {
            if (row._id === "success") {
                totalAmount += row.totalAmount;
            }
            totalTransaction += row.totalTransaction;
            if (row._id === "success")
                totalSuccessful = row.totalTransaction;
            if (row._id === "pending")
                totalPending = row.totalTransaction;
            if (row._id === "failed")
                totalFailed = row.totalTransaction;
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
    }
    catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch dashboard data",
        });
    }
});
exports.dashboardData = dashboardData;
