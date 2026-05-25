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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
                setImagePreview(product.posters?.[0]?.url || null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            if (formData.product_name) data.append('product_name', formData.product_name);
            if (formData.product_description) data.append('product_description', formData.product_description);
            if (formData.product_price) data.append('product_price', String(formData.product_price));
            if (formData.stock !== undefined) data.append('stock', String(formData.stock));
            if (formData.subcategory_id) data.append('subcategory_id', String(formData.subcategory_id));
            
            if (imageFile) {
                data.append('image', imageFile);
            }

            await updateAdminProduct(Number(id), data);
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
                    <label>Product Image</label>
                    {imagePreview && (
                        <div className={styles.imagePreview}>
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <p className={styles.helpText}>Leave empty to keep current image</p>

                    <label style={{marginTop: '20px'}}>Subcategory</label>
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
