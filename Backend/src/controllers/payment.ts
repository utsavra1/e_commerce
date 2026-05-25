import { Request, Response, NextFunction } from "express";
import { generateEsewaSignature, ESEWA_CONFIG } from "../services/payment.ts";
import { AppDataSource } from "../config/database.ts";
import { Order } from "../entites/Order.ts";
import { sendEmail } from "../utils/mailer.ts";
import { User } from "../entites/User.ts";
import crypto from 'crypto';

const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    console.log(">>> Backend: initiatePayment called for Order ID:", req.body.order_id);
    try {
        const { order_id } = req.body;
        const orderRepo = AppDataSource.getRepository(Order);
        const order = await orderRepo.findOne({ where: { order_id } });

        if (!order) return res.status(404).json({ message: "Order not found" });

        const cleanAmount = Number(order.total_amount).toString();
        
        const transaction_uuid = `ORDER-${order_id}-${Date.now()}`;
        
        const signatureString = `total_amount=${cleanAmount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_CONFIG.merchant_id}`;

        const signature = generateEsewaSignature(ESEWA_CONFIG.secret_key, signatureString);

        order.transaction_uuid = transaction_uuid;
        await orderRepo.save(order);

        const paymentData = {
            amount: cleanAmount,
            tax_amount: "0",
            total_amount: cleanAmount,
            transaction_uuid: transaction_uuid,
            product_code: ESEWA_CONFIG.merchant_id,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: ESEWA_CONFIG.success_url,
            failure_url: ESEWA_CONFIG.failure_url,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature,
        };

        console.log(">>> Backend: Sending payment data to frontend. No verification has happened yet.");
        return res.status(200).json({ payment_url: ESEWA_CONFIG.demo_url, payment_data: paymentData });
    } catch (err) { 
        console.error(">>> Backend: Error in initiatePayment:", err);
        next(err); 
    }
};

const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    console.log(">>> Backend: verifyPayment called. This should ONLY happen AFTER you pay on eSewa.");
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ message: "No data provided for verification" });

        const decodedData = Buffer.from(data, 'base64').toString('utf-8');
        const paymentInfo = JSON.parse(decodedData);
        console.log(">>> Backend: Decoded payment info:", paymentInfo);

        const message = `transaction_code=${paymentInfo.transaction_code},status=${paymentInfo.status},total_amount=${paymentInfo.total_amount},transaction_uuid=${paymentInfo.transaction_uuid},product_code=${paymentInfo.product_code},signed_field_names=${paymentInfo.signed_field_names}`;
        const expectedSignature = generateEsewaSignature(ESEWA_CONFIG.secret_key, message);

        if (expectedSignature !== paymentInfo.signature) {
            console.error(">>> Backend: Signature mismatch in verification!");
            return res.status(400).json({ message: "Invalid signature" });
        }

        if (paymentInfo.status !== "COMPLETE") {
            console.log(`>>> Payment failed/cancelled for ${paymentInfo.transaction_uuid}`);
            return res.status(200).json({ message: "Payment was not successful", status: paymentInfo.status });
        }

        const orderRepo = AppDataSource.getRepository(Order);
        const userRepo = AppDataSource.getRepository(User);
        
        const order = await orderRepo.findOne({ 
            where: { transaction_uuid: paymentInfo.transaction_uuid },
            relations: ['orderitem', 'orderitem.product', 'user']
        });

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.payment_status = "paid";
        await orderRepo.save(order);

        const user = await userRepo.findOne({ where: { user_id: order.user.user_id } });
        if (user?.email) {
            const orderSummary = {
                order_id: order.order_id,
                total_amount: order.total_amount,
                items: order.orderitem.map(item => ({
                    product_name: item.product.product_name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            sendEmail(user.email, orderSummary).catch(err => console.error(err));
        }

        return res.status(200).json({ message: "Success", order });
    } catch (err) {
        next(err);
    }
};

export { initiatePayment, verifyPayment };