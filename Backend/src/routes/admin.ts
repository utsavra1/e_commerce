import { Router } from "express";
import {
  createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
  createSubcategory, updateSubcategory, deleteSubcategory,
} from '../controllers/admin.ts';
import { authenticate } from '../middleware/auth.ts';
import { authorizeAdmin } from '../middleware/authorize.ts';
import  validate  from '../middleware/validate.ts';
import {
  createProductSchema, updateProductSchema,
  createCategorySchema, updateCategorySchema,
  createSubcategorySchema, updateSubcategorySchema,
} from '../schemas/admin.ts';

const router = Router();

router.use(authenticate, authorizeAdmin);
router.post('/products', validate(createProductSchema), createProduct);
router.patch('/products/:product_id', validate(updateProductSchema), updateProduct);
router.delete('/products/:product_id', deleteProduct);

router.post('/categories', validate(createCategorySchema), createCategory);
router.patch('/categories/:category_id', validate(updateCategorySchema), updateCategory);
router.delete('/categories/:category_id', deleteCategory);

router.post('/subcategories', validate(createSubcategorySchema), createSubcategory);
router.patch('/subcategories/:subcategory_id', validate(updateSubcategorySchema), updateSubcategory);
router.delete('/subcategories/:subcategory_id', deleteSubcategory);

export default router;
