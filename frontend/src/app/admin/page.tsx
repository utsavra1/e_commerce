'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, fetchAdminOrders, fetchCategories } from '@/services/api';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCategories: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [productsData, ordersData, categoriesData] = await Promise.all([
                    fetchProducts(1, 1), // Just to get total count if available, or just fetch all for now
                    fetchAdminOrders(),
                    fetchCategories()
                ]);

                const revenue = ordersData.reduce((acc, order) => acc + Number(order.total_amount), 0);

                setStats({
                    totalProducts: productsData.total,
                    totalOrders: ordersData.length,
                    totalCategories: categoriesData.length,
                    totalRevenue: revenue
                });
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1>Dashboard Overview</h1>
                <p>Welcome to the Admin Control Panel</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📦</div>
                    <div className={styles.statInfo}>
                        <h3>Total Products</h3>
                        <p>{stats.totalProducts}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📜</div>
                    <div className={styles.statInfo}>
                        <h3>Total Orders</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📁</div>
                    <div className={styles.statInfo}>
                        <h3>Categories</h3>
                        <p>{stats.totalCategories}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statInfo}>
                        <h3>Total Revenue</h3>
                        <p>Rs {stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className={styles.recentActivity}>
                <h2>System Status</h2>
                <div className={styles.statusList}>
                    <div className={styles.statusItem}>
                        <span>Backend API</span>
                        <span className={styles.statusOnline}>Online</span>
                    </div>
                    <div className={styles.statusItem}>
                        <span>Database</span>
                        <span className={styles.statusOnline}>Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
