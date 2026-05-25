'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, CreateProductInput } from '@/types';
import { fetchCategories, createAdminProduct } from '@/services/api';
import styles from './page.module.css';

export default function AddProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<CreateProductInput>({
        product_name: '',
        product_description: '',
        product_price: 0,
        stock: 0,
        subcategory_id: 0,
        product_image: ''
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error(error);
                alert('Error loading categories');
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

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
    setSubmitting(true);
    try {
        const data = new FormData();
        data.append('product_name', formData.product_name);
        data.append('product_description', formData.product_description);
        data.append('product_price', String(formData.product_price));
        data.append('stock', String(formData.stock));
        data.append('subcategory_id', String(formData.subcategory_id));
        
        if (imageFile) {
            data.append('image', imageFile); 
        }

        await createAdminProduct(data);
        alert('Product added successfully!');
        router.push('/admin/products');
    } catch (error: any) {
        console.error('Error adding product:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add product';
        alert(errorMessage);
    } finally {
        setSubmitting(false);
    }
};

    if (loading) return <div className={styles.container}>Loading form data...</div>;

    return (
        <div className={styles.container}>
            <h1>Add New Product</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Product Name</label>
                    <input 
                        name="product_name" 
                        value={formData.product_name} 
                        onChange={handleChange} 
                        placeholder="e.g. Wireless Mouse"
                        required 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea 
                        name="product_description" 
                        value={formData.product_description} 
                        onChange={handleChange} 
                        placeholder="Detailed description of the product..."
                        required 
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Price (Rs)</label>
                        <input 
                            name="product_price" 
                            type="number" 
                            value={formData.product_price} 
                            onChange={handleChange} 
                            min="0"
                            required 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Stock Quantity</label>
                        <input 
                            name="stock" 
                            type="number" 
                            value={formData.stock} 
                            onChange={handleChange} 
                            min="0"
                            required 
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Product Image</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Subcategory</label>
                    <select 
                        name="subcategory_id" 
                        value={formData.subcategory_id} 
                        onChange={handleChange} 
                        required
                    >
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

                <div className={styles.actions}>
                    <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>Cancel</button>
                    <button type="submit" disabled={submitting} className={styles.submitBtn}>
                        {submitting ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
