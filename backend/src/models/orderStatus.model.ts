import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrderStatus extends Document {
  collect_id: mongoose.Types.ObjectId;
  order_amount: number;
  collectRequestId:string;
  transaction_amount: number;
  payment_mode: "netbanking" 
  payment_details: string;
  bank_reference: string;
  payment_message: string;
  status: "pending" | "success" | "failed" ;
  error_message: string;
  payment_time: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderStatusSchema = new Schema<IOrderStatus>(
  {
    collect_id: {
      type: Schema.Types.ObjectId,
      required: [true, "Collect ID is required"],
      ref: "Order",
    },
    order_amount: {
      type: Number,
      required: [true, "Order amount is required"],
      min: [0, "Order amount must be positive"],
    },
    collectRequestId :{
      type:String,
    },
    transaction_amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0, "Transaction amount must be positive"],
    },
    payment_mode: {
      type: String,
      required: [true, "Payment mode is required"],
      enum: ["upi", "netbanking", "credit_card", "debit_card", "wallet" , "PhonePe", "Paytm", "Razorpay", "UPI", "NetBanking"],
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
  },
  { timestamps: true }
);

const OrderStatus: Model<IOrderStatus> = mongoose.model<IOrderStatus>(
  "OrderStatus",
  orderStatusSchema
);

export default OrderStatus;
