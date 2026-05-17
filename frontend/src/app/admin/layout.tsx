'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./layout.module.css";

export default function AdminLayout({children}: {children: React.ReactNode}) {
    const {user, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/'); // Redirect to home
        }
    }, [user, isLoading, router]);

    if (isLoading) 
        return <div className={styles.loading}>Checking permissions...</div>;
    if (!user || user.role !== 'admin') 
        return null;

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Panel</h2>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>📊 Dashboard</Link>
                    <Link href="/admin/products" className={styles.navLink}>📦 Products</Link>
                    <Link href="/admin/orders" className={styles.navLink}>📜 Orders</Link>
                    <Link href="/admin/categories" className={styles.navLink}>📁 Categories</Link>
                    <Link href="/" className={styles.navLink}>🏠 Back to Store</Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
