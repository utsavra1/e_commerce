import { Resend } from 'resend';
import { env } from '../config/env.ts';

const resend = new Resend(process.env['RESEND_API_KEY']);

export const sendEmail = async (to: string, orderDetails: any) =>{
    if(!process.env['RESEND_API_KEY']) {
        console.warn('Resend API key missing. Receipt not sent.');
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

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: `Order Receipt #${orderDetails.order_id}`,
            html: htmlContent,
        });
    } catch (error) {
        console.error('Failed to send receipt via Resend:', error);
    }
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

    const isSandboxRecipient = to.toLowerCase() !== 'utsavrail15@gmail.com'; 

    try {
        if (isSandboxRecipient && process.env['NODE_ENV'] === 'production') {
            return;
        }

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: `Email Verification Code`,
            html: htmlContent,
        });
    } catch (error) {
        if (isSandboxRecipient) {
            return;
        }
        throw error;
    }
};