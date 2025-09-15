"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderStatusSchema = new mongoose_1.Schema({
    collect_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Collect ID is required"],
        ref: "Order",
    },
    order_amount: {
        type: Number,
        required: [true, "Order amount is required"],
        min: [0, "Order amount must be positive"],
    },
    collectRequestId: {
        type: String,
    },
    transaction_amount: {
        type: Number,
        required: [true, "Transaction amount is required"],
        min: [0, "Transaction amount must be positive"],
    },
    payment_mode: {
        type: String,
        required: [true, "Payment mode is required"],
        enum: ["upi", "netbanking", "credit_card", "debit_card", "wallet", "PhonePe", "Paytm", "Razorpay", "UPI", "NetBanking"],
    },
    payment_details: {
        type: String,
        required: [true, "Payment details are required"],
    },
    bank_reference: {
        type: String,
        required: [true, "Bank reference is required"],
    },
    payment_message: {
        type: String,
        required: [true, "Payment message is required"],
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
        required: [true, "Status is required"],
    },
    error_message: {
        type: String,
        default: "NA",
    },
    payment_time: {
        type: Date,
        required: [true, "Payment time is required"],
    },
}, { timestamps: true });
const OrderStatus = mongoose_1.default.model("OrderStatus", orderStatusSchema);
exports.default = OrderStatus;
