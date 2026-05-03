import {z} from 'zod';

export const addToCartSchema = z.object({
    product_id: z.number({ message: 'Product ID must be a number' })
    .int('Product ID must be an integer')
    .positive('Product ID must be a positive number'),
    quantity: z.number({message: 'Quantity must be a number'})
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
});

export const updateCartSchema = z.object({
    quantity: z.number({message: 'Quantity must be number'})
    .int('Quantity must be integer')
    .min(1, 'Quantity must be at least 1')
})