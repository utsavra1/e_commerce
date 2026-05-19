import { Router } from 'express';
import { placeOrder, getMyOrder, getOrderById } from '../controllers/order.ts';
import { authenticate } from '../middleware/auth.ts';
import  validate  from '../middleware/validate.ts'
import { placeOrderSchema } from '../schemas/order.ts';


const router = Router();

router.post('/place', authenticate, validate(placeOrderSchema), placeOrder);
router.get('/me', authenticate, getMyOrder);                
router.get('/:order_id', authenticate, getOrderById);

export default router;