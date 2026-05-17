import { z } from 'zod';

export const ProductFilterSchema = z.object({
  search: z.string().optional(), // For keyword search
  minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest']).optional(),
  category_id: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  subcategory_id: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  page: z.string().optional().default('1').transform((val) => parseInt(val, 10)),
  limit: z.string().optional().default('10').transform((val) => parseInt(val, 10)),
});

export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;