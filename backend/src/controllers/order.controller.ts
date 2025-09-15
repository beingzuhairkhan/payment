import { Request, Response } from "express";
import { createPaymentValidation } from '../utils/validation'
import Order from "../models/order.model";
import OrderStatus from "../models/orderStatus.model";
import jwt from 'jsonwebtoken'
import axios from 'axios'

export const createPayment = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const { error } = createPaymentValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const trusteeId = req.user?._id;
        
        const { school_id, student_info, gateway_name = "NetBanking", order_amount } = data
        const order = await Order.create({
            school_id,
            trustee_id: trusteeId,
            student_info,
            gateway_name: gateway_name,
            order_amount: parseFloat(order_amount),
        })

        const orderStatus = await OrderStatus.create({
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
        })

        const vanillaPayload = {
            school_id: process.env.EDVIRON_SCHOOL_ID,
            amount: order_amount.toString(),
            callback_url: `${process.env.FRONTEND_URL}/payment-callback`,
        };

        const vanillaSign = jwt.sign(vanillaPayload, process.env.PG_SECRET!);

        //  Call Edviron Collect Request API
        const response = await axios.post(
            "https://dev-vanilla.edviron.com/erp/create-collect-request",
            {
                ...vanillaPayload,
                sign: vanillaSign,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.PG_API_KEY}`,
                },
            }
        );

        //console.log("Response Data:", response.data);

        const collect_request_id = response.data.collect_request_id;

        const updatedStatus = await OrderStatus.findOneAndUpdate(
            { collect_id: order._id },
            { collectRequestId: collect_request_id },
            { new: true }
        );
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


    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create payment request'
        });
    }
}


export const verifyPayment = async (req: Request, res: Response) => {
    const { collect_request_id } = req.query;
    if (!collect_request_id) {
        return res.status(400).json({ error: "collect_request_id is required" });
    }
    try {
        const school_id = process.env.EDVIRON_SCHOOL_ID
        const pgSecret = process.env.PG_SECRET
        // Create JWT for verification
        const sign = jwt.sign(
            { school_id, collect_request_id },
             pgSecret,
            { expiresIn: "1h" }
        );

        // Call Edviron API to check payment status
        const response = await axios.get(
            `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}`,
            {
                params: { school_id, sign },
                headers: {
                    Authorization: `Bearer ${process.env.PG_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const paymentData = response.data;
  
        const updatedOrder = await OrderStatus.findOneAndUpdate(
            { collectRequestId: collect_request_id },
            {
                status: paymentData.status.toLowerCase(),
                order_amount: paymentData.amount,
                transaction_amount: paymentData.transaction_amount || paymentData.amount,
                payment_mode: paymentData.details?.payment_mode || "NA",
                payment_details: paymentData.details?.payment_methods?.upi?.upi_id || "NA",
                bank_reference: paymentData.details?.bank_ref || "NA",
                payment_message: paymentData.status_code === 200 ? "Payment verified" : "Payment pending",
                payment_time: paymentData.payment_time ? new Date(paymentData.payment_time) : new Date(),
                error_message: paymentData.status_code !== 200 ? "Payment failed" : "NA",
            },
            { new: true }
        );

        //console.log(updatedOrder);

        res.json({
            status: "success",
            message: "Payment verified and OrderStatus updated",
            data: updatedOrder,
        });

    } catch (error: any) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Payment verification failed" });
    }
};

