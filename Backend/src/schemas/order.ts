import { z } from 'zod';

export const placeOrderSchema = z.object({
  order_description: z.string()
    .min(3, 'Order description must be at least 3 characters')
    .max(200, 'Order description must not exceed 200 characters'),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
