'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category, UpdateProductInput } from '@/types';
import { fetchProductById, fetchCategories, updateAdminProduct } from '@/services/api';
import styles from './page.module.css';

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<UpdateProductInput>({
        product_name: '',
        product_description: '',
        product_price: 0,
        stock: 0,
        subcategory_id: undefined,
        product_image: ''
    });



    useEffect(() => {
        const loadData = async () => {
            try {
                const [product, cats] = await Promise.all([
                    fetchProductById(Number(id)),
                    fetchCategories()
                ]);
                
                setCategories(cats);
                setFormData({
                    product_name: product.product_name,
                    product_description: product.product_description,
                    product_price: Number(product.product_price),
                    stock: product.stock,
                    subcategory_id: product.subcategory?.subcategory_id,
                    product_image: product.posters?.[0]?.url || ''
                });
            } catch (error) {
                console.error(error);
                window.alert('Error loading product data');
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: ['product_price', 'stock', 'subcategory_id'].includes(name) 
                ? Number(value) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure subcategory_id is not 0 if it was initialized that way
            const submitData = { ...formData };
            if (submitData.subcategory_id === 0) delete submitData.subcategory_id;

            await updateAdminProduct(Number(id), submitData);
            window.alert('Product updated successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            window.alert('Failed to update product');
        }
    };

    if (loading) return <div className={styles.container}>Loading product data...</div>;

    return (
        <div className={styles.container}>
            <h1>Edit Product #{id}</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Product Name</label>
                    <input name="product_name" value={formData.product_name || ''} onChange={handleChange} required />
                </div>

                <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea name="product_description" value={formData.product_description || ''} onChange={handleChange} required />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Price (Rs)</label>
                        <input name="product_price" type="number" value={formData.product_price || 0} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Stock Quantity</label>
                        <input name="stock" type="number" value={formData.stock || 0} onChange={handleChange} required />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Product Image URL</label>
                        <input 
                            name="product_image" 
                            value={formData.product_image || ''} 
                            onChange={handleChange} 
                            placeholder="https://example.com/image.jpg"
                        />
                    <label>Subcategory</label>
                    <select name="subcategory_id" value={formData.subcategory_id || ''} onChange={handleChange} required>
                        <option value="">Select a subcategory</option>
                        {categories.map(cat => (
                            <optgroup key={cat.category_id} label={cat.category_name}>
                                {cat.subcategories.map(sub => (
                                    <option key={sub.subcategory_id} value={sub.subcategory_id}>
                                        {sub.subcategory_name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <button type="submit" className={styles.submitBtn}>Update Product</button>
            </form>
        </div>
    );
}
