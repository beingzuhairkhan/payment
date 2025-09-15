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
exports.verifyPayment = exports.createPayment = void 0;
const validation_1 = require("../utils/validation");
const order_model_1 = __importDefault(require("../models/order.model"));
const orderStatus_model_1 = __importDefault(require("../models/orderStatus.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const { error } = validation_1.createPaymentValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const trusteeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { school_id, student_info, gateway_name = "NetBanking", order_amount } = data;
        const order = yield order_model_1.default.create({
            school_id,
            trustee_id: trusteeId,
            student_info,
            gateway_name: gateway_name,
            order_amount: parseFloat(order_amount),
        });
        const orderStatus = yield orderStatus_model_1.default.create({
            collect_id: order._id,
            order_amount: parseFloat(order_amount),
            transaction_amount: parseFloat(order_amount),
            payment_mode: order.gateway_name.toLowerCase(),
            payment_details: 'Pending',
            bank_reference: 'PENDING',
            payment_message: 'Payment initiated',
            status: 'pending',
            error_message: 'N/A',
            payment_time: new Date()
        });
        const vanillaPayload = {
            school_id: process.env.EDVIRON_SCHOOL_ID,
            amount: order_amount.toString(),
            callback_url: `${process.env.FRONTEND_URL}/payment-callback`,
        };
        const vanillaSign = jsonwebtoken_1.default.sign(vanillaPayload, process.env.PG_SECRET);
        //  Call Edviron Collect Request API
        const response = yield axios_1.default.post("https://dev-vanilla.edviron.com/erp/create-collect-request", Object.assign(Object.assign({}, vanillaPayload), { sign: vanillaSign }), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PG_API_KEY}`,
            },
        });
        //console.log("Response Data:", response.data);
        const collect_request_id = response.data.collect_request_id;
        const updatedStatus = yield orderStatus_model_1.default.findOneAndUpdate({ collect_id: order._id }, { collectRequestId: collect_request_id }, { new: true });
        res.json({
            status: "success",
            message: "Payment request created successfully",
            data: {
                order_id: order._id,
                custom_order_id: collect_request_id,
                payment_url: response.data.collect_request_url,
                order_amount: order.order_amount,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create payment request'
        });
    }
});
exports.createPayment = createPayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g;
    const { collect_request_id } = req.query;
    if (!collect_request_id) {
        return res.status(400).json({ error: "collect_request_id is required" });
    }
    try {
        const school_id = process.env.EDVIRON_SCHOOL_ID;
        const pgSecret = process.env.PG_SECRET;
        // Create JWT for verification
        const sign = jsonwebtoken_1.default.sign({ school_id, collect_request_id }, pgSecret, { expiresIn: "1h" });
        // Call Edviron API to check payment status
        const response = yield axios_1.default.get(`https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}`, {
            params: { school_id, sign },
            headers: {
                Authorization: `Bearer ${process.env.PG_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const paymentData = response.data;
        const updatedOrder = yield orderStatus_model_1.default.findOneAndUpdate({ collectRequestId: collect_request_id }, {
            status: paymentData.status.toLowerCase(),
            order_amount: paymentData.amount,
            transaction_amount: paymentData.transaction_amount || paymentData.amount,
            payment_mode: ((_b = paymentData.details) === null || _b === void 0 ? void 0 : _b.payment_mode) || "NA",
            payment_details: ((_e = (_d = (_c = paymentData.details) === null || _c === void 0 ? void 0 : _c.payment_methods) === null || _d === void 0 ? void 0 : _d.upi) === null || _e === void 0 ? void 0 : _e.upi_id) || "NA",
            bank_reference: ((_f = paymentData.details) === null || _f === void 0 ? void 0 : _f.bank_ref) || "NA",
            payment_message: paymentData.status_code === 200 ? "Payment verified" : "Payment pending",
            payment_time: paymentData.payment_time ? new Date(paymentData.payment_time) : new Date(),
            error_message: paymentData.status_code !== 200 ? "Payment failed" : "NA",
        }, { new: true });
        //console.log(updatedOrder);
        res.json({
            status: "success",
            message: "Payment verified and OrderStatus updated",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error(((_g = error.response) === null || _g === void 0 ? void 0 : _g.data) || error.message);
        res.status(500).json({ error: "Payment verification failed" });
    }
});
exports.verifyPayment = verifyPayment;
