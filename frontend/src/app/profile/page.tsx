'use client'; 

import { useEffect, useState } from 'react';
import { User, UpdateProfileInput } from '@/types'; 
import { fetchUserProfile, updateUserProfile } from '@/services/api'; 
import styles from './page.module.css';

export default function ProfilePage () {
    const [user, setUser] = useState<User | null>(null);
    const [loading, isLoading] = useState(true);
    // for editing profile 
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<UpdateProfileInput>({})

     const loadProfile = async () => {
        try {
            const data = await fetchUserProfile();
            const userData = data.user || data;
            setUser(userData);
            setForm({
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                dob: userData.dob ? userData.dob.split('T')[0] : ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            isLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await updateUserProfile(form);
            setUser(response.user);
            setEditing(false);
            alert('Profile updated');
            
        } catch (error) {
            console.error(error);
        } finally{
            isLoading(false);
        }
    }


    if (loading) return <div className={styles.loading}>Loading your profile...</div>;
    if (!user) return <div className={styles.error}>Please login to see your profile.</div>;

     return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                
                {editing? (
                    <form onSubmit={handleUpdate} className={styles.editForm}>
                        <div className={styles.inputGroup}>
                            <label>Username</label>
                            <input name='username' value={form.username} onChange={handleChange}  required/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Phone</label>
                            <input name="phone" value={form.phone} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>DOB</label>
                            <input name="dob" type="date" value={form.dob} onChange={handleChange} />
                        </div>
                        <div>
                            <button type='submit' className={styles.saveBtn}>Save </button>
                            <button type='button' onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ): (
                <>
                <h1 className={styles.username}>{user.username}</h1>
                <p className={styles.email}>{user.email}</p>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <label>Phone Number</label>
                        <span>{user.phone || 'Not provided'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <label>Date of Birth</label>
                        <span>{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</span>
                    </div>
                </div>

                <button onClick={() => setEditing(true)} className={styles.editBtn}>Edit Profile</button>
                </>
              )}
            </div>
        </div>
    );
}