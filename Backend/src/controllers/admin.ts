import { Request, Response, NextFunction } from "express";
import {
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from '../schemas/admin.ts';
import * as adminService from '../services/admin.ts';
import {cloudinary} from '../config/cloudinary.ts';


const createProduct = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let imageUrl = req.body.product_image;

        if((req as any).file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'products' }, (error: any, result: any) => {
                    if (error) 
                        reject(error);
                    else 
                        resolve(result);
                }).end((req as any).file!.buffer);
            });
            imageUrl = (result as any).secure_url;
        }

        const input = { ...req.body, product_image: imageUrl };
        const product = await adminService.createNewProduct(input);

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
        let updateData = { ...req.body };

        if(isNaN(product_id)){
            return res.status(400).json({message: 'Invalid Id'});
        }

        if ((req as any).file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'products' }, (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end((req as any).file!.buffer);
            });
            updateData.product_image = (result as any).secure_url;
        }

        const product = await adminService.updateExistingProduct(product_id, updateData);

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
            return res.status(400).json({message: 'Invalid id'})
        }

        await adminService.deleteExistingProduct(product_id);

        return res.status(200).json({ message: 'Product deleted successfully' }); 
    } catch (err) {
        next(err);
    }
};

// Category

const createCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as CreateCategoryInput;
        const category = await adminService.createNewCategory(input);

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
            return res.status(400).json({message: 'Invalid Id'});
        }

        const category = await adminService.updateExistingCategory(category_id, body);

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
            return res.status(400).json({message: 'Invalid Id'});
        }

        await adminService.deleteExistingCategory(category_id);

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
        const input = req.body as CreateSubcategoryInput;
        const subcategory = await adminService.createNewSubcategory(input);

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
        const body = req.body as UpdateSubcategoryInput;
        const subcategory_id = parseInt(req.params['subcategory_id'] as string, 10);

        if (isNaN(subcategory_id)) {
            return res.status(400).json({ message: 'Invalid subcategory ID' });
        }

        const subcategory = await adminService.updateExistingSubcategory(subcategory_id, body);

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

        await adminService.deleteExistingSubcategory(subcategory_id);

        return res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export {createProduct, createCategory, createSubcategory, updateProduct, updateCategory, updateSubcategory, deleteProduct, deleteCategory, deleteSubcategory};
