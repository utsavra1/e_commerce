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
    merchant_id: 'EPAYTEST', 
    secret_key: '8gBm/:&EnhH.1/q', 
    demo_url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    success_url: 'http://localhost:3001/checkout/success',
    failure_url: 'http://localhost:3001/checkout/failure',
};
