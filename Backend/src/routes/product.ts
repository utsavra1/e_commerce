import { Router } from 'express';
import { getAllProducts, getProductByCategory, getProductsBySubcategory, getproductById, getCategories } from '../controllers/product.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { ProductFilterSchema } from '../schemas/product.ts';

const router = Router();

router.get('/categories', getCategories);
router.get('/', validate(ProductFilterSchema, 'query'), getAllProducts);
router.get('/subcategory/:subcategoryId', getProductsBySubcategory);
router.get('/category/:categoryId', getProductByCategory);
router.get('/:id', getproductById);

export default router;