'use client';

import { useState, useEffect } from 'react';
import { Review, CreateReviewInput } from '@/types';
import { fetchReviewsByProductId, createReview } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import styles from './reviews.module.css';
import React from 'react';

export default function ReviewSection ({productId}: {productId: number}) {
    const [rating, setRating] = useState(5);
    const isAuthenticated = useAuth();
    const [review, setReview] = useState<Review[]>([]);
    const [comments, isComment] = useState('');

    const loadReview = async() =>{
        try {
            const data = await fetchReviewsByProductId(productId);
            setReview(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadReview();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent ) =>{
        e.preventDefault();
        try {
            await createReview (productId, {rating, comments});
            setRating(5);
            isComment('');
            loadReview();
            alert('Review Submitted successfully');

        } catch (error) {
            alert(error instanceof Error ? error.message : 'Error submitting review');
        }
    };

    return(
        <div className={styles.container}>
            <h2>Customers Review</h2>
            <div className={styles.list}>
                {review.length === 0? <p>No reviews yet. Be the first</p> : 
                review.map(r => (
                    <div key = {r.review_id}className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                            <strong>{r.user.username}</strong>
                            <span className={styles.stars}> 
                                {'★' .repeat(r.rating)}{'☆' .repeat(5-r.rating)}
                            </span>
                        </div>
                        <p>{r.comments}</p>
                    </div>
                ))
                }
            </div>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>Write a Review</h3>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                    <textarea 
                    value={comments} 
                    onChange={(e) => isComment(e.target.value)} 
                    placeholder="What did you think of this product?"
                    required
                    />
                    <button type="submit">Submit Review</button>
                </form>
            ): <p className={styles.loginMsg}>Please login to leave a review.</p>}
        </div>
    );
}