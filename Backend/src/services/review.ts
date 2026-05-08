import { AppDataSource } from '../app.ts';
import { Review } from '../entites/Review.ts';
import { Product } from '../entites/Product.ts';
import { CreateReviewInput } from '../schemas/review.ts';

const createProductReview = async(user_id: number, product_id: number, input: CreateReviewInput) =>{
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
      where: { product_id },
    });

    if (!product) {
        const error: any = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    const reviewRepo = AppDataSource.getRepository(Review);
    const existingReview = await reviewRepo.findOne({
      where: {
        user: { user_id },
        product: { product_id },
      },
    });

    if (existingReview) {
        const error: any = new Error('You have already reviewed this product');
        error.status = 409;
        throw error;
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
        const error: any = new Error('Product not found');
        error.status = 409;
        throw error;
    }

    const review = await reviewRepo.find({
      where: {product: {product_id}},
      relations: ['user'],
    });

    if(review.length === 0){
        const error: any = new Error('ther is no review for this product');
        error.status = 409;
        throw error;
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
        const error: any = new Error('Review not found');
        error.status = 409;
        throw error;
    }

    await reviewRepo.remove(review);
};

export {createProductReview, fetchProductReview, deleteProductReview};