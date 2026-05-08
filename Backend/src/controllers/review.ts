import { Request, Response, NextFunction } from 'express';
import { CreateReviewInput } from '../schemas/review.ts';
import * as reviewService from '../services/review.ts';

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = parseInt(req.params['product_id'] as string, 10);
    const input = req.body as CreateReviewInput;

    if (isNaN(product_id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const review = await reviewService.createProductReview(user_id, product_id, input);

    return res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (err) {
    next(err);
  }
};

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product_id = parseInt(req.params['product_id'] as string, 10);

    if(isNaN(product_id)){
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const result = await reviewService.fetchProductReview(product_id);

    return res.status(200).json(result);
    
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user.user_id;
    const review_id = parseInt(req.params['review_id'] as string, 10);

    if(isNaN(review_id)){
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    await reviewService.deleteProductReview(user_id, review_id);

    return res.status(200).json({ message: 'Review deleted successfully' });

  } catch (err) {
    next(err);
  }
}

export {createReview, deleteReview, getReviews} ;
