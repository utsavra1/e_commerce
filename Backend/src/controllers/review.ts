import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../app.ts';
import { Review } from '../entites/Review.ts';
import { Product } from '../entites/Product.ts';
import { CreateReviewInput } from '../schemas/review.ts';


const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = parseInt(req.params['product_id'] as string, 10);
    const { rating, comments } = req.body as CreateReviewInput;

    if (isNaN(product_id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // ── step 1: check if product exists ──────────────────────────────
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: { product_id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ── step 2: check if user already reviewed this product ──────────
    const reviewRepo = AppDataSource.getRepository(Review);
    const existingReview = await reviewRepo.findOne({
      where: {
        user: { user_id },
        product: { product_id },
      },
    });

    if (existingReview) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }

    // ── step 3: create review ─────────────────────────────────────────
    const review = reviewRepo.create({
      rating,
      comments,
      user: { user_id },
      product: { product_id },
    });
    await reviewRepo.save(review);

    return res.status(201).json({
      message: 'Review submitted successfully',
      review: {
        review_id: review.review_id,
        rating: review.rating,
        comments: review.comments,
      },
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

    const productRepo = AppDataSource.getRepository(Product);
    const reviewRepo = AppDataSource.getRepository(Review);
    
    const product = await productRepo.findOne({
      where: {product_id},
    });

    if(!product){
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = await reviewRepo.find({
      where: {product: {product_id}},
      relations: ['user'],
    });

    if(review.length === 0){
      return res.status(404).json({ message: 'No reviews found for this product' });
    }

    const averageRating = review.reduce((sum, review) => {
      return sum + review.rating;
    }, 0)/review.length;

    return res.status(200).json({
      product_name: product.product_name,
      total_reviews: review.length,
      average_rating: parseFloat(averageRating.toFixed(1)), // round to 1 decimal
      reviews: review.map((review) => ({
        review_id: review.review_id,
        rating: review.rating,
        comments: review.comments,
        reviewed_by: review.user.username,
      })),
    });
    
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

    const reviewRepo = AppDataSource.getRepository(Review);
    const review = await reviewRepo.findOne({
      where: {
        review_id,
        user: {user_id}
      },
      relations: ['user'],
    });

    if(!review){
      return res.status(404).json({ message: 'Review not found' });
    }

    await reviewRepo.remove(review);
    return res.status(200).json({ message: 'Review deleted successfully' });

  } catch (err) {
    next(err);
  }
}

export {createReview};