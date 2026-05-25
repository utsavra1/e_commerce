'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, fetchAdminOrders, fetchCategories } from '@/services/api';
import styles from './page.module.css';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCategories: 0,
        totalRevenue: 0,
        dailyOrders: 0,
        dailyEarnings: 0,
        chartData: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [productsData, ordersData, categoriesData] = await Promise.all([
                    fetchProducts(1, 1), 
                    fetchAdminOrders(),
                    fetchCategories()
                ]);

                const today = new Date().toLocaleDateString();
                
                const dailyOrders = ordersData.filter((o: any) => 
                    new Date(o.order_date).toLocaleDateString() === today
                );

                const dailyEarnings = dailyOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);

                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toLocaleDateString();
                    const dayOrders = ordersData.filter((o: any) => new Date(o.order_date).toLocaleDateString() === dateStr);
                    return {
                        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        orders: dayOrders.length,
                        sales: dayOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)
                    };
                }).reverse();

                let runningRevenue = 0;
                let runningOrders = 0;
                const progressiveData = last7Days.map(day => {
                    runningRevenue += day.sales;
                    runningOrders += day.orders;
                    return {
                        ...day,
                        cumulativeSales: runningRevenue,
                        cumulativeOrders: runningOrders
                    };
                });

                setStats({
                    totalProducts: productsData.total,
                    totalOrders: ordersData.length,
                    totalCategories: categoriesData.length,
                    totalRevenue: ordersData.reduce((acc: number, order: any) => acc + Number(order.total_amount), 0),
                    dailyOrders: dailyOrders.length,
                    dailyEarnings: dailyEarnings,
                    chartData: progressiveData
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
                    <div className={styles.statIcon}>📅</div>
                    <div className={styles.statInfo}>
                        <h3>Orders Today</h3>
                        <p>{stats.dailyOrders}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💸</div>
                    <div className={styles.statInfo}>
                        <h3>Today's Earnings</h3>
                        <p>Rs {stats.dailyEarnings.toLocaleString()}</p>
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

            <div className={styles.chartsGrid}>
                <div className={styles.chartBox}>
                    <h3>Weekly Sales Revenue (Rs)</h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartBox}>
                    <h3>Weekly Order Volume</h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#818cf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartBox}>
                    <h3>Cumulative Revenue Growth (Rs)</h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `Rs ${value}`} />
                                <Line 
                                    type="monotone" 
                                    dataKey="cumulativeSales" 
                                    stroke="#10b981" 
                                    strokeWidth={3} 
                                    dot={{ r: 4 }} 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartBox}>
                    <h3>Cumulative Order Progression</h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="cumulativeOrders" 
                                    stroke="#f59e0b" 
                                    strokeWidth={3} 
                                    dot={{ r: 4 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
