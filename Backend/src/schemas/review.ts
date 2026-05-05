import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number({ message: 'Rating must be a number' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  comments: z.string()
    .min(3, 'Comment must be at least 3 characters')
    .max(200, 'Comment must not exceed 200 characters'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;