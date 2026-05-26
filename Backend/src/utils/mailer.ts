import nodemailer from 'nodemailer';
import { env } from '../config/env.ts';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: env.email.user,
        pass: env.email.pass,
    },
});

export const sendEmail = async (to: string, orderDetails: any) =>{
    if(!env.email.user || !env.email.pass) {
        console.warn('Email credentials missing. Receipt not sent.');
        return;
    }

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #2c3e50; text-align: center;">Order Receipt</h2>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <p><strong>Order ID:</strong> #${orderDetails.order_id}</p>
                <hr />
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <th style="text-align: left; padding: 10px 0;">Product</th>
                            <th style="text-align: center; padding: 10px 0;">Qty</th>
                            <th style="text-align: right; padding: 10px 0;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails.items.map((item: any) => `
                            <tr>
                                <td style="padding: 10px 0;">${item.product_name}</td>
                                <td style="text-align: center; padding: 10px 0;">${item.quantity}</td>
                                <td style="text-align: right; padding: 10px 0;">Rs ${item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr />
                <p style="text-align: right; font-size: 1.2rem;"><strong>Total: Rs ${orderDetails.total_amount}</strong></p>
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: `"E-Store" <${env.email.user}>`,
        to,
        subject: `Order Receipt #${orderDetails.order_id}`,
        html: htmlContent,
});
};

export const sendOTPEmail = async (to: string, otp: string) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 12px;">
            <h2 style="color: #6366f1;">Verify Your Email</h2>
            <p>Thank you for registering! Your verification code is:</p>
            <h1 style="letter-spacing: 5px; color: #111827; background: #f3f4f6; padding: 10px; display: inline-block;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
        </div>
    `;

    await transporter.sendMail({
        from: `"E-Store" <${env.email.user}>`,
        to,
        subject: `Email Verification Code`,
        html: htmlContent,
    });
};