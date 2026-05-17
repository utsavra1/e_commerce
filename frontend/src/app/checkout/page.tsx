'use client';

import { placeOrder } from "@/services/api";
import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css"

export default function CheckoutPage (){
    const {cart, refreshCart} = useCart();
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handlePlaceOrder = async (e: React.FormEvent) =>{
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await placeOrder({order_description: description });
            await refreshCart()
            router.push('/checkout/success');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if(!cart || cart.items.length === 0){
         return <div className={styles.container}>Your cart is empty.</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Finalize Your Order</h1>
            <div className={styles.layout}>
                <form onSubmit={handlePlaceOrder} className={styles.form}>
                    <label>Delivery Instructions / Description</label>
                    <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Please leave at the front door.."
                    required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Place Order Now' }
                    </button>
                </form>

                <div className={styles.summary}>
                    <h3> Order Summary </h3>
                    <p>Total Item: {cart.total_items}</p>
                    <p className={styles.total}>Total Amount: Rs {cart.total_price}</p>
                </div>
            </div>
        </div>
    )

}