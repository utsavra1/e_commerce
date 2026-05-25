'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { fetchAdminOrders } from '@/services/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    const today = new Date().toLocaleDateString();
    const dailyOrders = orders.filter(o => new Date(o.order_date).toLocaleDateString() === today);
    const dailyEarnings = dailyOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

    const loadOrders = async () => {
        try {
            const data = await fetchAdminOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(); }, []);

    if (loading) return <div className={styles.loading}>Loading orders...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>All Customer Orders</h1>
                <div className={styles.kpiContainer}>
                    <div className={styles.kpiCard}>
                        <span>Total Orders</span>
                        <strong>{orders.length}</strong>
                    </div>
                    <div className={styles.kpiCard}>
                        <span>Orders Today</span>
                        <strong>{dailyOrders.length}</strong>
                    </div>
                    <div className={styles.kpiCard}>
                        <span>Today's Earnings</span>
                        <strong>Rs {dailyEarnings.toLocaleString()}</strong>
                    </div>
                    <div className={styles.kpiCard}>
                        <span>Total Revenue</span>
                        <strong>Rs {totalRevenue.toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id}>
                                <td>#{order.order_id}</td>
                                <td>
                                    <div className={styles.customerInfo}>
                                        <span className={styles.customerName}>{(order as any).user?.username || 'Guest'}</span>
                                        <span className={styles.customerEmail}>{(order as any).user?.email}</span>
                                    </div>
                                </td>
                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                <td className={styles.amount}>Rs {order.total_amount}</td>
                                <td>{order.orderitem.length} Items</td>
                                <td>
                                    <Link href={`/admin/orders/${order.order_id}`} className={styles.viewBtn}>
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
