import { Router } from 'express';
import { getMyCart, addToCart, updateCart, removeFromCart } from '../controllers/cart.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { addToCartSchema } from '../schemas/cart.ts';
import { updateCartSchema } from '../schemas/cart.ts';


const router = Router();

router.post('/add', authenticate, validate(addToCartSchema), addToCart)
router.get('/my', authenticate, getMyCart);
router.post('/update/:cart_item_id', authenticate, validate(updateCartSchema), updateCart)
router.post('/delete/:cart_item_id', authenticate, removeFromCart)

export default router;