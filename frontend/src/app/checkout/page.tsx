'use client';

import { placeOrder, initiateEsewaPayment } from "@/services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";
import { toast } from 'react-toastify';

export default function CheckoutPage() {
    const { cart, refreshCart } = useCart();
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const orderResponse = await placeOrder({ order_description: description });
            const orderId = orderResponse.order.order_id;
            const { payment_url, payment_data } = await initiateEsewaPayment(orderId);

            // Create and submit eSewa form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = payment_url;

            for (const key in payment_data) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = payment_data[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return <div className={styles.container}>Your cart is empty.</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Finalize Your Order</h1>
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
                        {isSubmitting ? 'Processing...' : 'Pay with eSewa' }
                    </button>
                </form>

                <div className={styles.summary}>
                    <h3> Order Summary </h3>
                    <p>Total Items: {cart.total_items}</p>
                    <p className={styles.total}>Total Amount: Rs {cart.total_price}</p>
                </div>
            </div>
        </div>
    );
}