import { z } from 'zod';

// ── product schemas ───────────────────────────────────────────────────
export const createProductSchema = z.object({
  product_name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters'),
  product_description: z.string()
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must not exceed 200 characters'),
  product_price: z.number({ message: 'Price must be a number' })
    .positive('Price must be a positive number'),
  stock: z.number({ message: 'Stock must be a number' })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  subcategory_id: z.number({ message: 'Subcategory ID must be a number' })
    .int()
    .positive(),
  product_image: z.string()
  .url('Invalid image URL')
  .optional()
  .or(z.literal('')),
});

export const updateProductSchema = z.object({
  product_name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .optional(),
  product_description: z.string()
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must not exceed 200 characters')
    .optional(),
  product_price: z.number({ message: 'Price must be a number' })
    .positive('Price must be a positive number')
    .optional(),
  stock: z.number({ message: 'Stock must be a number' })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .optional(),
  subcategory_id: z.number({ message: 'Subcategory ID must be a number' })
    .int()
    .positive()
    .optional(),
  product_image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// ── category schemas ──────────────────────────────────────────────────
export const createCategorySchema = z.object({
  category_name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters'),
});

export const updateCategorySchema = z.object({
  category_name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters')
    .optional(),
});

// ── subcategory schemas ───────────────────────────────────────────────
export const createSubcategorySchema = z.object({
  subcategory_name: z.string()
    .min(2, 'Subcategory name must be at least 2 characters')
    .max(100, 'Subcategory name must not exceed 100 characters'),
  category_id: z.number({ message: 'Category ID must be a number' })
    .int()
    .positive(),
});

export const updateSubcategorySchema = z.object({
  subcategory_name: z.string()
    .min(2, 'Subcategory name must be at least 2 characters')
    .max(100, 'Subcategory name must not exceed 100 characters')
    .optional(),
  category_id: z.number({ message: 'Category ID must be a number' })
    .int()
    .positive()
    .optional(),
});

// ── inferred types ────────────────────────────────────────────────────
export type CreateProductInput    = z.infer<typeof createProductSchema>;
export type UpdateProductInput    = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput   = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput   = z.infer<typeof updateCategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
