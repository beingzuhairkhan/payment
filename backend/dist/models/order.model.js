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
const orderSchema = new mongoose_1.Schema({
    school_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
    },
    trustee_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    student_info: {
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true,
        },
        id: {
            type: String,
            required: [true, "Student ID is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Student email is required"],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
    },
    gateway_name: {
        type: String,
        enum: ["NetBanking"],
        default: "NetBanking",
        required: true,
    },
    custom_order_id: {
        type: String,
        unique: true,
        required: false,
    },
    order_amount: {
        type: Number,
        required: [true, "Order amount is required"],
        min: [0, "Order amount must be positive"],
    },
}, { timestamps: true });
orderSchema.pre("save", function (next) {
    if (!this.custom_order_id) {
        this.custom_order_id = `ORD_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
    }
    next();
});
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
