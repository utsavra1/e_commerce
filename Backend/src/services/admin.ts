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
import { createError } from "../utils/error.ts";

const createNewProduct = async (input: CreateProductInput) => {
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
        const productRepo = AppDataSource.getRepository(Product);
        const subcategory = await subcategoryRepo.findOne({
            where: {subcategory_id: input.subcategory_id},
        });

        if(!subcategory){
            throw createError('Subcategory not found', 404);
        }

        const product = productRepo.create({
            product_name: input.product_name,
            product_description: input.product_description,
            product_price: input.product_price,
            stock: input.stock,
            subcategory
        });
        await productRepo.save(product);
        return product;

};
const updateExistingProduct = async (product_id: number, input: UpdateProductInput) => {
    const productRepo = AppDataSource.getRepository(Product);
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
    const product = await productRepo.findOne({
        where: {product_id},
    })

    if(!product){
        throw createError('Product not found', 404);
}

    if(input.product_name)
        product.product_name = input.product_name;
    if(input.product_description)
        product.product_description = input.product_description;
    if(input.product_price)
        product.product_price = input.product_price;
    if(input.stock !== undefined)
        product.stock = input.stock;

    if(input.subcategory_id){
        const subcategory = await subcategoryRepo.findOne({
            where: {subcategory_id : input.subcategory_id},
        });

        if(!subcategory){
            throw createError('Subcategory not found', 404);
        }

        product.subcategory = subcategory;
    }

    await productRepo.save(product);
    return product;
};
const deleteExistingProduct = async (product_id: number) => {
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
        where: {product_id},
    });

    if(!product){
        throw createError('Product not available', 404);
    }

    await productRepo.remove(product);

};
const createNewCategory = async (input: CreateCategoryInput) => {
    const categoryRepo = AppDataSource.getRepository(Categories);
    const category = await categoryRepo.findOne({
        where: {category_name: input.category_name},
    });

    if(category){
        throw createError('Category already exist', 404);
    }

    const newcategory =  categoryRepo.create({category_name: input.category_name});
    await categoryRepo.save(newcategory);
    return newcategory;
};

const updateExistingCategory = async (category_id: number, input: UpdateCategoryInput) => {
    const categoryRepo = AppDataSource.getRepository(Categories);
        const category = await categoryRepo.findOne({
            where: {category_id},
        });

        if(!category){
            const error: any = new Error('Category do not exist');
            error.status = 404;
            throw error;
        }

        if(input.category_name)
            category.category_name = input.category_name;

        await categoryRepo.save(category);
        return category;
}
const deleteExistingCategory = async (category_id: number) => {
    const categoryRepo = AppDataSource.getRepository(Categories);
        const category = await categoryRepo.findOne({
            where: {category_id},
            relations: ['subcategory'],
        });

        if(!category){
            throw createError('Category do not exist', 404);
        }

        if (category.subcategory.length > 0) {
            throw createError(`Cannot delete category. It has ${category.subcategory.length} subcategories. Delete them first`, 404);
        }
        await categoryRepo.remove(category);
}
const createNewSubcategory = async ( input: CreateSubcategoryInput) => {
    const categoryRepo = AppDataSource.getRepository(Categories);
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
    const category = await categoryRepo.findOne({
        where: {category_id: input.category_id},
    });

    if(!category){
         throw createError('Category do not exist', 404);
    }
    const subcategory = await subcategoryRepo.findOne({
        where: {subcategory_name: input.subcategory_name,
        categories: {category_id: input.category_id},
        },
    });

    if(subcategory){
         throw createError('Subategory already exist', 404);
    }

    const newsubcategory = await subcategoryRepo.create({
        subcategory_name: input.subcategory_name,
        categories: category,
    });
    await subcategoryRepo.save(newsubcategory);
    return newsubcategory;

};
const updateExistingSubcategory = async (subcategory_id: number, input: UpdateSubcategoryInput) => {
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
        const subcategory = await subcategoryRepo.findOne({
            where: {subcategory_name: input.subcategory_name,
            categories: {category_id: input.category_id},
            },
        });

        if(!subcategory){
             throw createError('Subcategory do not exist', 404);
        }

        if(input.subcategory_name)
            subcategory.subcategory_name = input.subcategory_name;

        if (input.category_id) {
            const categoryRepo = AppDataSource.getRepository(Categories);
            const category = await categoryRepo.findOne({
                where: { category_id: input.category_id },
            });

            if (!category) {
                 throw createError('Category do not exist', 404);
            }
            subcategory.categories = category;
        }

        await subcategoryRepo.save(subcategory);
        return subcategory;
}

const deleteExistingSubcategory = async (subcategory_id: number) => {
    const subcategoryRepo = AppDataSource.getRepository(Subcategory);
    const subcategory = await subcategoryRepo.findOne({
      where: { subcategory_id },
      relations: ['product'], // load products to check
    });

    if (!subcategory) {
        throw createError('Subcategory do not exist', 404);
    }

    
    if (subcategory.product.length > 0) {
        const error: any = new Error(`Cannot delete subcategory. It has ${subcategory.product.length} products. Delete them first`);
        error.status = 400;
        throw error;
    }

    await subcategoryRepo.remove(subcategory);
    
}

export {createNewCategory, createNewProduct, createNewSubcategory, updateExistingCategory, updateExistingProduct, updateExistingSubcategory, deleteExistingCategory, deleteExistingProduct,deleteExistingSubcategory};