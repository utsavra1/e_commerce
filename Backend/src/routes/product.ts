import { Router } from 'express';
import { getAllProducts, getProductByCategory, getProductsBySubcategory, getproductById } from '../controllers/product.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/', authenticate, getAllProducts);
router.get('/subcategory/:subcategoryId', authenticate, getProductsBySubcategory);
router.get('/category/:categoryId', authenticate, getProductByCategory);
router.get('/:id', authenticate, getproductById);

export default router;