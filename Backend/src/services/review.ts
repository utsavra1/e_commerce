import { AppDataSource } from '../app.ts';
import { Review } from '../entites/Review.ts';
import { Product } from '../entites/Product.ts';
import { CreateReviewInput } from '../schemas/review.ts';
import { createError } from '../utils/error.ts';

const createProductReview = async(user_id: number, product_id: number, input: CreateReviewInput) =>{
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: { product_id },
    });

    if (!product) {
        throw createError('Product not found', 404);
    }

    const reviewRepo = AppDataSource.getRepository(Review);
    const existingReview = await reviewRepo.findOne({
      where: {
        user: { user_id },
        product: { product_id },
      },
    });

    if (existingReview) {
        throw createError('You have already reviewed this product', 404);
    }

    const review = reviewRepo.create({
      rating: input.rating,
      comments: input.comments,
      user: { user_id },
      product: { product_id },
    });
    await reviewRepo.save(review);

    return {
        review_id: review.review_id,
        rating: review.rating,
        comments: review.comments,
  };
};

const fetchProductReview = async(product_id: number) => {

    const productRepo = AppDataSource.getRepository(Product);
    const reviewRepo = AppDataSource.getRepository(Review);
    
    const product = await productRepo.findOne({
      where: {product_id},
    });

    if(!product){
        throw createError('Product not found', 404);
    }

    const review = await reviewRepo.find({
      where: {product: {product_id}},
      relations: ['user'],
    });

    if(review.length === 0){
      return {
          product_name: product.product_name,
          total_reviews: 0,
          average_rating: 0,
          reviews: [],
      }
    }

    const averageRating = review.reduce((sum, review) => {
      return sum + review.rating;
    }, 0)/review.length;

    return {
        product_name: product.product_name,
        total_reviews: review.length,
        average_rating: parseFloat(averageRating.toFixed(1)), // round to 1 decimal
        reviews: review.map((review) => ({
            review_id: review.review_id,
            rating: review.rating,
            comments: review.comments,
            reviewed_by: review.user.username,
      })),
    }
}

const deleteProductReview = async(user_id: number, review_id: number) => {
    const reviewRepo = AppDataSource.getRepository(Review);
    const review = await reviewRepo.findOne({
      where: {
        review_id,
        user: {user_id}
      },
      relations: ['user'],
    });

    if(!review){
        throw createError('Review not found', 404);
    }

    await reviewRepo.remove(review);
};

export {createProductReview, fetchProductReview, deleteProductReview};