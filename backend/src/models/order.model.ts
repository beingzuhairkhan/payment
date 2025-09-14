import mongoose, { Document, Schema, Model } from "mongoose";


export interface IOrder extends Document {
  school_id: mongoose.Types.ObjectId;
  trustee_id: mongoose.Types.ObjectId;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  gateway_name:  "NetBanking";
  custom_order_id: string;
  order_amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
    trustee_id: {
      type: Schema.Types.ObjectId,
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
      enum: [ "NetBanking"],
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
  },
  { timestamps: true }
);


orderSchema.pre<IOrder>("save", function (next) {
  if (!this.custom_order_id) {
    this.custom_order_id = `ORD_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  next();
});


const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
