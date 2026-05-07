import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../app.ts";
import { Product } from '../entites/Product.ts';
import { Categories } from '../entites/Categories.ts';
import { Subcategory } from '../entites/Subcategory.ts';
import {
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from '../schemas/admin.ts';


const createProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { product_name, product_description, product_price, stock, subcategory_id } = req.body as CreateProductInput;

        const subcategoryRepo = AppDataSource.getRepository(Subcategory);
        const productRepo = AppDataSource.getRepository(Product);
        const subcategory = await subcategoryRepo.findOne({
            where: {subcategory_id},
        });

        if(!subcategory){
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const product = productRepo.create({
            product_name,
            product_description,
            product_price,
            stock,
            subcategory
        });
        await productRepo.save(product);

        return res.status(201).json({
            message: 'Product created successfully',
            product,
    });
    } catch (err) {
        next(err);
    }
};

const updateProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const product_id = parseInt(req.params['product_id'] as string, 10);
        const body = req.body as UpdateProductInput;

        if(isNaN(product_id)){
            return res.status(401).json({message: 'invalid Id'});
        }

        const productRepo = AppDataSource.getRepository(Product);
        const subcategoryRepo = AppDataSource.getRepository(Subcategory);
        const product = await productRepo.findOne({
            where: {product_id},
        })

        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }

        if(body.product_name)
            product.product_name = body.product_name;
        if(body.product_description)
            product.product_description = body.product_description;
        if(body.product_price)
            product.product_price = body.product_price;
        if(body.stock !== undefined)
            product.stock = body.stock;

        if(body.subcategory_id){
            const subcategory = await subcategoryRepo.findOne({
                where: {subcategory_id : body.subcategory_id},
            });

            if(!subcategory){
                return res.status(404).json({ message: 'Subcategory not found' });
            }

            product.subcategory = subcategory;
        }

        await productRepo.save(product);
        return res.status(200).json({
            message: 'Product updated successfully',
            product,
    });
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const product_id = parseInt(req.params['product_id'] as string, 10);

        if(isNaN(product_id)){
            return res.status(401).json({message: 'Invalid id'})
        }

        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOne({
            where: {product_id},
        });

        if(!product){
            return res.status(401).json({message: 'Product not available'});
        }

        await productRepo.remove(product);

        return res.status(200).json({ message: 'Product deleted successfully' }); 
    } catch (err) {
        next(err);
    }
};

// Category

const createCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {category_name} = req.body as CreateCategoryInput;

        const categoryRepo = AppDataSource.getRepository(Categories);
        const category = await categoryRepo.findOne({
            where: {category_name},
        });

        if(category){
            return res.status(401).json({message: 'Category already exist'});
        }

        const newcategory =  categoryRepo.create({category_name});
        await categoryRepo.save(newcategory);
         return res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (err) {
        next(err);
    }
};

const updateCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as UpdateCategoryInput;
        const category_id = parseInt(req.params['category_id'] as string, 10);

        if(isNaN(category_id)){
            return res.status(401).json({message: 'Invalid Id'});
        }

        const categoryRepo = AppDataSource.getRepository(Categories);
        const category = await categoryRepo.findOne({
            where: {category_id},
        });

        if(!category){
            return res.status(401).json({message: 'Category do not exist'});
        }

        if(body.category_name)
            category.category_name = body.category_name;

        await categoryRepo.save(category);
        return res.status(200).json({
            message: 'Category updated successfully',
            category,
        });
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const category_id = parseInt(req.params['category_id'] as string, 10);

        if(isNaN(category_id)){
            return res.status(401).json({message: 'Invalid Id'});
        }

        const categoryRepo = AppDataSource.getRepository(Categories);
        const category = await categoryRepo.findOne({
            where: {category_id},
            relations: ['subcategory'],
        });

        if(!category){
            return res.status(401).json({message: 'Category do not exist'});
        }

        if (category.subcategory.length > 0) {
            return res.status(400).json({
                message: `Cannot delete category. It has ${category.subcategory.length} subcategories. Delete them first`,
            });
        }
        await categoryRepo.remove(category);
        return res.status(200).json({
            message: 'Category deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};

//Subcategory

const createSubcategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {subcategory_name, category_id} = req.body as CreateSubcategoryInput;

        const categoryRepo = AppDataSource.getRepository(Categories);
        const subcategoryRepo = AppDataSource.getRepository(Subcategory);
        const category = await categoryRepo.findOne({
            where: {category_id},
        });

        if(!category){
            return res.status(401).json({message: 'Category do not exist'});
        }

        const subcategory = await subcategoryRepo.findOne({
            where: {subcategory_name,
            categories: {category_id},
            },
        });

        if(subcategory){
            return res.status(401).json({message: 'SubCategory already exist'});
        }

        const newsubcategory = await subcategoryRepo.create({
            subcategory_name,
            categories: category,
        });
        await subcategoryRepo.save(newsubcategory);
        return res.status(201).json({
            message: 'Subcategory created successfully',
            subcategory,
        });
    } catch (err) {
        next(err);
    }
};

const updateSubcategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {subcategory_name, category_id} = req.body as CreateSubcategoryInput;
        const subcategory_id = parseInt(req.params['subcategory_id'] as string, 10);

        if (isNaN(subcategory_id)) {
            return res.status(400).json({ message: 'Invalid subcategory ID' });
        }

        const subcategoryRepo = AppDataSource.getRepository(Subcategory);
        const subcategory = await subcategoryRepo.findOne({
            where: {subcategory_name,
            categories: {category_id},
            },
        });

        if(!subcategory){
            return res.status(401).json({message: 'SubCategory doesnt exist'});
        }

        if(subcategory_name)
            subcategory.subcategory_name = subcategory_name;

        if (category_id) {
            const categoryRepo = AppDataSource.getRepository(Categories);
            const category = await categoryRepo.findOne({
                where: { category_id: category_id },
            });

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            subcategory.categories = category;
        }

        await subcategoryRepo.save(subcategory);

        return res.status(200).json({
            message: 'Subcategory updated successfully',
            subcategory,
        });
    } catch (err) {
        next(err);
    }
};

const deleteSubcategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const subcategory_id = parseInt(req.params['subcategory_id'] as string, 10);

    if (isNaN(subcategory_id)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
    const subcategory = await subcategoryRepo.findOne({
      where: { subcategory_id },
      relations: ['product'], // load products to check
    });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    
    if (subcategory.product.length > 0) {
      return res.status(400).json({
        message: `Cannot delete subcategory. It has ${subcategory.product.length} products. Delete them first`,
      });
    }

    await subcategoryRepo.remove(subcategory);

    return res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export {createProduct, createCategory, createSubcategory, updateProduct, updateCategory, updateSubcategory, deleteProduct, deleteCategory, deleteSubcategory};