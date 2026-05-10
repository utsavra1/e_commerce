import { Router } from 'express';
import { getAllProducts, getProductByCategory, getProductsBySubcategory, getproductById } from '../controllers/product.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { ProductFilterSchema } from '../schemas/product.ts';

const router = Router();

router.get('/', validate(ProductFilterSchema, 'query'), getAllProducts);
router.get('/subcategory/:subcategoryId', authenticate, getProductsBySubcategory);
router.get('/category/:categoryId', authenticate, getProductByCategory);
router.get('/:id', authenticate, getproductById);

export default router;