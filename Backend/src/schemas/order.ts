import { z } from 'zod';

export const placeOrderSchema = z.object({
  order_description: z.string()
    .min(3, 'Order description must be at least 3 characters')
    .max(200, 'Order description must not exceed 200 characters'),
  payment_method: z.enum(['esewa', 'cod'] as const, {
    message: "Please select a valid payment method (esewa or cod)"
  }),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  street_address: z.string().min(1, 'Street address is required'),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
