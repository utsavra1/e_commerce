'use client'; 

import { useEffect, useState } from 'react';
import { User, UpdateProfileInput } from '@/types'; 
import { fetchUserProfile, updateUserProfile, fetchMyAddresses, addAddress, deleteAddress } from '@/services/api'; 
import styles from './page.module.css';
import { addressData } from '@/constants/addressData';

export default function ProfilePage () {
    const [user, setUser] = useState<User | null>(null);
    const [loading, isLoading] = useState(true);
    // for editing profile 
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<UpdateProfileInput>({})

    // Address management state
    const [addresses, setAddresses] = useState<any[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddr, setNewAddr] = useState({
        label: '',
        province: '',
        district: '',
        city: '',
        street_address: ''
    });

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

            // Load addresses too
            const addrData = await fetchMyAddresses();
            setAddresses(addrData.addresses);
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

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAddress(newAddr);
            const addrData = await fetchMyAddresses();
            setAddresses(addrData.addresses);
            setShowAddressForm(false);
            setNewAddr({ label: '', province: '', district: '', city: '', street_address: '' });
            alert('Address added successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to add address');
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await deleteAddress(id);
            setAddresses(addresses.filter(a => a.address_id !== id));
        } catch (error) {
            console.error(error);
        }
    };


    if (loading) return <div className={styles.loading}>Loading your profile...</div>;
    if (!user) return <div className={styles.error}>Please login to see your profile.</div>;

     return (
        <div className={styles.container}>
            <div className={styles.layout}>
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
                            <div className={styles.formActions}>
                                <button type='submit' className={styles.saveBtn}>Save </button>
                                <button type='button' onClick={() => setEditing(false)} className={styles.cancelBtn}>Cancel</button>
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

                <div className={styles.addressSection}>
                    <div className={styles.sectionHeader}>
                        <h2>My Addresses</h2>
                        <button 
                            className={styles.addAddrBtn}
                            onClick={() => setShowAddressForm(!showAddressForm)}
                        >
                            {showAddressForm ? 'Cancel' : '+ Add Address'}
                        </button>
                    </div>

                    {showAddressForm && (
                        <form onSubmit={handleAddAddress} className={styles.addressForm}>
                            <input 
                                placeholder="Address Label (e.g. Home, Work)" 
                                value={newAddr.label}
                                onChange={e => setNewAddr({...newAddr, label: e.target.value})}
                                required 
                            />
                            <div className={styles.row}>
                                <select 
                                    value={newAddr.province} 
                                    onChange={e => setNewAddr({...newAddr, province: e.target.value, district: ''})}
                                    required
                                >
                                    <option value="">Province</option>
                                    {Object.keys(addressData).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <select 
                                    value={newAddr.district} 
                                    onChange={e => setNewAddr({...newAddr, district: e.target.value})}
                                    disabled={!newAddr.province}
                                    required
                                >
                                    <option value="">District</option>
                                    {newAddr.province && addressData[newAddr.province as keyof typeof addressData].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <input 
                                placeholder="City" 
                                value={newAddr.city}
                                onChange={e => setNewAddr({...newAddr, city: e.target.value})}
                                required 
                            />
                            <input 
                                placeholder="Street Address" 
                                value={newAddr.street_address}
                                onChange={e => setNewAddr({...newAddr, street_address: e.target.value})}
                                required 
                            />
                            <button type="submit" className={styles.saveAddrBtn}>Save Address</button>
                        </form>
                    )}

                    <div className={styles.addressList}>
                        {addresses.length === 0 ? (
                            <p className={styles.emptyMsg}>No saved addresses yet.</p>
                        ) : (
                            addresses.map(addr => (
                                <div key={addr.address_id} className={styles.addressCard}>
                                    <div className={styles.addrInfo}>
                                        <span className={styles.addrLabel}>{addr.label}</span>
                                        <p>{addr.street_address}, {addr.city}</p>
                                        <p>{addr.district}, {addr.province}</p>
                                    </div>
                                    <button 
                                        className={styles.deleteAddrBtn}
                                        onClick={() => handleDeleteAddress(addr.address_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}