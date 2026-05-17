'use client';

import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { Order } from "@/types";
import { useParams } from "next/navigation";
import { fetchOrderById } from "@/services/api";
import styles from "./page.module.css"


export default function OrderDetailPage (){
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrderDetail= async() => {
            try{
            const orderdata = await fetchOrderById(Number(params.id));
            setOrder(orderdata);
            } catch (error){
                console.error('Error loading order:', error);
            } finally {
                setLoading(false);
            }
        };
        if(params.id)
            loadOrderDetail();
    }, [params.id]);

    if(loading)
        return <div className={styles.loading}>Loading details...</div>;
    if(!order)
        return <div className={styles.error}>Order Not Found </div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Order Detail</h1>
                <p className={styles.orderId}>Order #{order.order_id}</p>
                <p className={styles.date}> Date: {new Date (order.order_date).toLocaleDateString()}</p>
            </div>

            <div className={styles.section}>
                <h3>Items in this Order</h3>
                <div className={styles.itemsList}>
                    {order.orderitem.map((item) => (
                        <div key={item.order_item_id} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                                <p className={styles.itemName}>{item.product.product_name}</p>
                                <p className={styles.itemQty}>Qty: {item.quantity}</p>
                            </div>
                            <div className={styles.itemPrice}>
                                <p>Rs {item.price}</p>
                                <p className={styles.subtotal}>Subtotal: Rs {Number(item.price) * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.summary}>
                <div className={styles.summaryRow}>
                    <span>Order Total</span>
                    <span className={styles.totalAmount}>Rs {order.total_amount}</span>
                </div>
                <div className={styles.description}>
                    <h4>Notes:</h4>
                    <p>{order.order_description}</p>
                </div>
            </div>
        </div>
    )
}