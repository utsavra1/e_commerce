'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { fetchCategories, createAdminCategory, deleteAdminCategory, createAdminSubcategory } from '@/services/api';
import styles from './page.module.css';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCatName, setNewCatName] = useState('');
    const [loading, setLoading] = useState(true);
    const [newSubNames, setNewSubNames] = useState<{[key: number]: string}>({});

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { loadCategories(); }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        try {
            await createAdminCategory(newCatName.trim());
            setNewCatName('');
            await loadCategories();
            window.alert('Category added!');
        } catch (error) { 
            console.error(error);
            window.alert('Error adding category'); 
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? This will only work if it has no subcategories.')) {
            try {
                await deleteAdminCategory(id);
                await loadCategories();
                window.alert('Category deleted!');
            } catch (error) { 
                console.error(error);
                window.alert('Cannot delete: Category might have subcategories or products.'); 
            }
        }
    };

   const handleAddSub = async (catId: number) => {
    const subName = newSubNames[catId];
    if (!subName?.trim()) return;
    try {
        await createAdminSubcategory(catId, subName.trim());
        // Fix: Explicitly type 'prev' to avoid the 'any' error
        setNewSubNames((prev: {[key: number]: string}) => ({ ...prev, [catId]: '' }));
        await loadCategories();
        window.alert('Subcategory added!');
    } catch (error) {
        console.error(error);
        window.alert('Error adding subcategory');
    }
};

    if (loading) return <div className={styles.loading}>Loading categories...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Category Management</h1>
                <form onSubmit={handleAdd} className={styles.addForm}>
                    <input 
                        placeholder="New Category Name" 
                        value={newCatName} 
                        onChange={(e) => setNewCatName(e.target.value)} 
                        required 
                    />
                    <button type="submit">Add Category</button>
                </form>
            </div>

            <div className={styles.grid}>
                {categories.map(cat => (
                    <div key={cat.category_id} className={styles.catCard}>
                        <div className={styles.catHeader}>
                            <h3>{cat.category_name}</h3>
                            <button onClick={() => handleDelete(cat.category_id)} className={styles.deleteBtn}>Delete</button>
                        </div>
                        <div className={styles.subContent}>
                            <h4 className={styles.subTitle}>Subcategories ({cat.subcategories.length})</h4>
                            <ul className={styles.subList}>
                                {cat.subcategories.map(sub => (
                                    <li key={sub.subcategory_id} className={styles.subItem}>
                                        {sub.subcategory_name}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.addSubForm}>
                                    <input 
                                        placeholder="Add Subcategory" 
                                        className={styles.subInput}
                                        value={newSubNames[cat.category_id] || ''} 
                                        onChange={(e) => setNewSubNames((prev: {[key: number]: string}) => ({ 
                                            ...prev, 
                                            [cat.category_id]: e.target.value 
                                        }))} 
                                    />
                                    <button onClick={() => handleAddSub(cat.category_id)} className={styles.subAddBtn}>
                                        +
                                    </button>
                                </div>
                            {cat.subcategories.length === 0 && <p className={styles.empty}>No subcategories yet.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
