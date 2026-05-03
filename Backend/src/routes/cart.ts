import { Router } from 'express';
import { getMyCart, addToCart } from '../controllers/cart.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { addToCartSchema } from '../schemas/cart.ts';


const router = Router();

router.post('/add', authenticate, validate(addToCartSchema), addToCart)
router.get('/my', authenticate, getMyCart);

export default router;