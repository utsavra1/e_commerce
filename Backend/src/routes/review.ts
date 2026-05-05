import { Router } from 'express';
import { createReview } from '../controllers/review.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { createReviewSchema } from '../schemas/review.ts';

const router = Router();

router.post('/:product_id', authenticate, validate(createReviewSchema), createReview);

export default router;