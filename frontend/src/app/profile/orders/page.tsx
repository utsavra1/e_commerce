'use client';

import Link from "next/link";
import { Order } from '@/types/index';
import { useEffect, useState } from "react";
import { fetchMyOrders } from "@/services/api";
import styles from "./page.module.css"


export default function OrderPage () {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchMyOrders();
                setOrders(data.orders);
                
            } catch (error) {
                console.error(error);
            } finally{
                setLoading(false)
            }
        };
        loadOrders();
    }, []);

    if(loading)
        return <div className={styles.loading}>Loading orders...</div>;

    return(
        <div className={styles.container}>
            <h1>View My Orders</h1>
            {orders.length === 0? (
                <p>You haven't placed any orders yet.</p>
            ): (
                <div className={styles.orderGrid}>
                    {orders.map((order) => (
                        <div key={order.order_id} className={styles.orderCard}>
                            <div className={styles.header}>
                                <span> Order # {order.order_id}</span>
                                <span className={styles.date}>{new Date(order.order_date).toLocaleDateString()}</span>
                            </div>
                            <p className={styles.desc}>{order.order_description}</p>
                            <div className={styles.footer}>
                                <span className={styles.amount}>Total: Rs {order.total_amount}</span>
                                <Link href={`/profile/orders/${order.order_id}`} className={styles.viewBtn}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}