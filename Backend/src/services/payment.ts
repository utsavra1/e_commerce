import crypto from "crypto";

export const generateEsewaSignature = (SecretKey: string, data: string): string => {
    const hmac = crypto.createHmac("sha256", SecretKey);
    hmac.update(data);
    const signature = hmac.digest('base64');
    console.log("--- eSewa Signature Debug ---");
    console.log("Data to sign:", data);
    console.log("Secret Key:", SecretKey);
    console.log("Generated Signature:", signature);
    console.log("-----------------------------");
    return signature;
};

export const ESEWA_CONFIG = {
    merchant_id: process.env['ESEWA_MERCHANT_ID'] || 'EPAYTEST', 
    secret_key: process.env['ESEWA_SECRET_KEY'] || '8gBm/:&EnhH.1/q', 
    demo_url: process.env['ESEWA_URL'] || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    success_url: process.env['ESEWA_SUCCESS_URL'] || 'http://localhost:3001/checkout/success',
    failure_url: process.env['ESEWA_FAILURE_URL'] || 'http://localhost:3001/checkout/failure',
};
