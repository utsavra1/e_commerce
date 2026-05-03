import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../app.ts';
import { Product } from '../entites/Product.ts'
import { id } from 'zod/locales';
import { Subcategory } from '../entites/Subcategory.ts';
import { Categories } from '../entites/Categories.ts';

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      relations: ['subcategory', 'subcategory.categories'],
    });
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// for geting product by id

const getproductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawId = req.params['id'];            
    const id = parseInt(rawId as string, 10); 

    if(isNaN(id)){
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const productRepo = await AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: {product_id: id},
      relations: ['subcategory', 'subcategory.categories'],
    });

    if(!product){
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
    
  } catch (err) {
      next(err);
  }

};

// get product by subcategory
const getProductsBySubcategory = async(req: Request, res: Response, next: NextFunction) =>{
  try {
    const rawId = req.params['subcategoryId'];
    const subcategoryId = parseInt(rawId as string, 10);

    if (isNaN(subcategoryId)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const subcategoryRepo = await AppDataSource.getRepository(Subcategory);
    const subcategory = await subcategoryRepo.findOne({
      where: {subcategory_id: subcategoryId},
    });

    if(!subcategory){
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      where:{
        subcategory: {subcategory_id: subcategoryId}
      },
      relations: ['subcategory', 'subcategory.categories'],
    });

    return res.status(200).json({
      subcategory: subcategory.subcategory_name,
      total: products.length,
      products,
    })


  } catch (err) {
    next(err);
  }
};

// now by catagory that goes through subcategory

const getProductByCategory = async (req: Request, res: Response, next: NextFunction) =>{
  try {
    const rawId = req.params['categoryId'];
    const categoryId = parseInt(rawId as string, 10);

    if(isNaN(categoryId)){
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const categoryRepo = AppDataSource.getRepository(Categories);
    const category = await categoryRepo.findOne({
      where: {
        category_id: categoryId
      }
    });

    if(!category){
      return res.status(404).json({ message: 'Category not found' });
    }

    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      where: {
        subcategory: {categories: {category_id: categoryId}}
      },
      relations: ['subcategory', 'subcategory.categories'],
    });

    return res.status(200).json({
      category: category.category_name,
      total: products.length,
      products,
    });

  } catch (err) {
    next(err);
  }
};

export {getAllProducts, getproductById, getProductsBySubcategory, getProductByCategory};