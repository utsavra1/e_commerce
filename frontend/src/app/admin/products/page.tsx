'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Product } from "@/types";
import { deleteAdminProduct, fetchProducts } from "@/services/api";

export default function AdminProductPage (){
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);


    const loadProducts = async() => {
        try {
            setLoading(true);
            const data = await fetchProducts(1, 50);
            setProducts(data.products);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if(window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteAdminProduct(id);
                alert('Product deleted');
                loadProducts();
            } catch (error) {
                console.error(error);
                alert('Failed to delete product');
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading products...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manage Products ({total})</h1>
                <Link href="/admin/products/add" className={styles.addBtn}>+ Add New Product</Link>
            </div>
            <div className={styles.kpiContainer}>
                <div className={styles.kpiCards}>
                    <span>Total Product</span>
                    <strong>{total}</strong>
                </div>
                <div className={styles.kpiCards}>
                    <span>Low Stock</span>
                    <strong className={styles.warningText}>{lowStockProducts.length}</strong>
                </div>
                <div className={styles.kpiCard}>
                    <span>Out of Stock</span>
                    <strong className={styles.dangerText}>{outOfStockProducts.length}</strong>
                </div>
            </div>

            {lowStockProducts.length > 0 && (
                <div className={styles.lowStockAlert}>
                    <span className={styles.alertIcon}>⚠️</span>
                    <div className={styles.alertContent}>
                    <strong>Low Stock Alert:</strong> {lowStockProducts.length} items are running low. Please restock soon.
                    <ul style={{marginTop: '5px', fontSize: '0.85rem', listStyle: 'none', padding: 0}}>
                            {lowStockProducts.slice(0, 3).map(p => (
                                <li key={p.product_id}>• {p.product_name} (Only {p.stock} left)</li>
                            ))}
                        </ul>
                </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.product_id}>
                                <td>#{p.product_id}</td>
                                <td>{p.product_name}</td>
                                <td>Rs {p.product_price}</td>
                                <td>{p.stock}</td>
                                <td className={styles.actions}>
                                    <Link href={`/admin/products/edit/${p.product_id}`} className={styles.editBtn}>
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(p.product_id)} className={styles.deleteBtn}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
