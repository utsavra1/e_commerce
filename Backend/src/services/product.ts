import { AppDataSource } from '../config/database.ts';
import { Product } from '../entites/Product.ts'
import { Subcategory } from '../entites/Subcategory.ts';
import { Categories } from '../entites/Categories.ts';
import { ILike, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ProductFilterInput } from '../schemas/product.ts';
import { createError } from '../utils/error.ts';


const fetchAllProducts = async (filters: ProductFilterInput) => {
    const { search, minPrice, maxPrice, sortBy, category_id, subcategory_id, page, limit } = filters;
    const productRepo = AppDataSource.getRepository(Product);


//Searching products
    let whereConditions: any = {};

    if(search){
      whereConditions.product_name = ILike(`%${search}%`);
    }

    if(minPrice !== undefined && maxPrice !== undefined){
      whereConditions.product_price = Between(minPrice, maxPrice);
    }
    else if (minPrice !== undefined){
      whereConditions.product_price = MoreThanOrEqual(minPrice);
    }
    else if (maxPrice !== undefined){
      whereConditions.product_price = LessThanOrEqual(maxPrice);
    }

    if (subcategory_id) {
      whereConditions.subcategory = { subcategory_id };
    } else if (category_id) {
      whereConditions.subcategory = { categories: { category_id } };
    }


    // Sorting

    let order: any = {};
    if (sortBy === 'price_asc') {
        order.product_price = 'ASC';
    } else if (sortBy === 'price_desc') {
        order.product_price = 'DESC';
    } else {
        order.product_id = 'DESC'; // Newest items first
    }
    const [products, total] = await productRepo.findAndCount({
      where: whereConditions, order,
      take: limit,
      skip: (page -1) * limit,
      relations: ['subcategory', 'subcategory.categories', 'posters'],
    });

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) 
    };
};

const fetchProductById = async(product_id: number) => {
    const productRepo = await AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: {product_id},
      relations: ['subcategory', 'subcategory.categories', 'posters'],
    });

    if(!product){
      throw createError('Product not found', 404); 
    }
    return product;
};

const fetchProductsBySubcategory = async(subcategory_id: number) =>{
    const subcategoryRepo = await AppDataSource.getRepository(Subcategory);
    const subcategory = await subcategoryRepo.findOne({
      where: {subcategory_id},
    });

    if(!subcategory){
      throw createError('Subcategory not found', 404);
    }

    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      where:{
        subcategory: {subcategory_id}
      },
      relations: ['subcategory', 'subcategory.categories', 'posters'],
    });
    return { subcategory: subcategory.subcategory_name, total: products.length, products };
};

const fetchProductsByCategory = async (category_id: number) =>{
    const categoryRepo = AppDataSource.getRepository(Categories);
    const category = await categoryRepo.findOne({
      where: {
        category_id
      }
    });

    if(!category){
      throw createError('Category not found', 404);
    }

    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      where: {
        subcategory: {categories: {category_id}}
      },
      relations: ['subcategory', 'subcategory.categories', 'posters'],
    });
    return { category: category.category_name, total: products.length, products };
};

const fetchAllCategories = async () => {
  const categoryRepo = AppDataSource.getRepository(Categories);
  return await categoryRepo.find({
    relations: ['subcategories']
  });
};

export {fetchAllProducts, fetchProductById, fetchProductsByCategory, fetchProductsBySubcategory, fetchAllCategories};
