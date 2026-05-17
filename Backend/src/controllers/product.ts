import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.ts';
import { ProductFilterSchema } from '../schemas/product.ts';

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.fetchAllProducts(req.query as any);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getproductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params['id'] as string, 10); 

    if(isNaN(id)){
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await productService.fetchProductById(id);

    return res.status(200).json(product);
    
  } catch (err) {
      next(err);
  }

};

const getProductsBySubcategory = async(req: Request, res: Response, next: NextFunction) =>{
  try {
    const subcategoryId = parseInt(req.params['subcategoryId'] as string, 10);

    if (isNaN(subcategoryId)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const result = await productService.fetchProductsBySubcategory(subcategoryId);

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

const getProductByCategory = async (req: Request, res: Response, next: NextFunction) =>{
  try {
    const categoryId = parseInt(req.params['categoryId'] as string, 10);

    if(isNaN(categoryId)){
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const result = await productService.fetchProductsByCategory(categoryId);

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await productService.fetchAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

export {getAllProducts, getproductById, getProductsBySubcategory, getProductByCategory, getCategories};
