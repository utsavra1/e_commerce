import { Router } from "express";
import { initiatePayment, verifyPayment } from "../controllers/payment.ts";
import { authenticate } from "../middleware/auth.ts"; 

const router = Router();

router.post("/initiate", authenticate, initiatePayment);
router.post("/verify", authenticate, verifyPayment);

export default router;