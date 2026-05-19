'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { fetchOrderById } from '@/services/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await fetchOrderById(Number(params.id));
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) loadOrder();
    }, [params.id]);

    if (loading) return <div className={styles.loading}>Loading order details...</div>;
    if (!order) return <div className={styles.error}>Order not found.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>← Back</button>
                <h1>Order Details #{order.order_id}</h1>
            </div>

            <div className={styles.grid}>
                <div className={styles.infoCard}>
                    <h3>Customer Information</h3>
                    <p><strong>Username:</strong> {(order as any).user?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {(order as any).user?.email || 'N/A'}</p>
                    <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                </div>

                <div className={styles.infoCard}>
                    <h3>Order Summary</h3>
                    <p><strong>Total Amount:</strong> <span className={styles.price}>Rs {order.total_amount}</span></p>
                    <p><strong>Description:</strong> {order.order_description || 'No description provided.'}</p>
                </div>
            </div>

            <div className={styles.itemsCard}>
                <h3>Ordered Items</h3>
                <table className={styles.itemTable}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderitem.map((item) => (
                            <tr key={item.order_item_id}>
                                <td>{item.product.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>Rs {item.price}</td>
                                <td>Rs {Number(item.price) * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}