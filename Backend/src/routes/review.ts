import { Router } from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/review.ts';
import { authenticate } from '../middleware/auth.ts';
import validate from '../middleware/validate.ts';
import { createReviewSchema } from '../schemas/review.ts';

const router = Router();

router.get('/:product_id', getReviews);
router.post('/:product_id', authenticate, validate(createReviewSchema), createReview);
router.delete('/:review_id', authenticate, deleteReview);

export default router;