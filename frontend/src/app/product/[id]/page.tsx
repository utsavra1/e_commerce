'use client';

import { fetchProductById } from "@/services/api";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useParams } from "next/navigation";
import styles from "./page.module.css"

export default function ProductDetail(){
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
        if(id){
            setLoading(true);
            setError(null);
            fetchProductById(id as string)
            .then(setProduct)
            .catch((err) => {
                console.error("Error fetching product:", err);
                setError(err.message || "Failed to load product");
            })
            .finally(() => setLoading(false));
        }

    }, [id]);

    if (loading) 
        return <div className={styles.loadingContainer}>Loading Product...</div>;
    
    if (error || !product) 
        return (
            <div className={styles.errorContainer}>
                <h2>Oops!</h2>
                <p>{error || "Product not found."}</p>
                <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
            </div>
        );

    return(
        <div className={styles.container}>
            <main className={styles.wrapper}>
                <div className={styles.layoutGrid}>
                    {/* Left Column: Gallery */}
                    <div className={styles.gallery}>
                        <div className={styles.mainImageFrame}>
                            {product.posters?.[0] ? (
                                <img src={product.posters[0].url} alt={product.product_name} className={styles.mainImage}/>
                            ):(
                                <div className={styles.noImage}>No Image Available</div>
                            )}
                        </div>
                        
                        {product.posters && product.posters.length > 1 && (
                            <div className={styles.thumbList}>
                                {product.posters.map((poster, index) => (
                                    <div key={index} className={styles.thumbItem}>
                                        <img src={poster.url} alt="" className={styles.thumbImage} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Info */}
                    <div className={styles.infoBox}>
                        <h1 className={styles.title}>
                            {product.product_name}
                        </h1>
                        <p className={styles.price}>
                            ${product.product_price}
                        </p>
                        <p className={styles.description}>
                            {product.product_description}
                        </p>
                        
                        <div className={styles.stockStatus}>
                            <div className={styles.dot} style={{ backgroundColor: Number(product.stock) > 0 ? '#22c55e' : '#ef4444' }}>
                            </div>
                            <span style={{color: Number(product.stock) > 0 ? '#22c55e' : '#ef4444'}}>
                                {Number(product.stock) > 0 ? `${product.stock} In Stock`: 'Out Of Stock'}
                            </span>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.buyBtn}>
                                Add to Shopping Bag
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
