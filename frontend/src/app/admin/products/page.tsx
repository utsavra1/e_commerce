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
