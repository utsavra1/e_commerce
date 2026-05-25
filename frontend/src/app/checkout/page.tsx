'use client';

import { placeOrder, initiateEsewaPayment, fetchMyAddresses, addAddress } from "@/services/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";
import {addressData} from "@/constants/addressData";
import { toast } from 'react-toastify';

export default function CheckoutPage() {
    const { cart, refreshCart, clearCart } = useCart();
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'cod'>('esewa');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');
    const [saveForFuture, setSaveForFuture] = useState(false);
    const [addressLabel, setAddressLabel] = useState('Home');
    const [newAddress, setNewAddress] = useState({
        province: '',
        district: '',
        city: '',
        street_address: ''
    });

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const data = await fetchMyAddresses();
                setSavedAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddressId(data.addresses[0].address_id);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            }
        };
        loadAddresses();
    }, []);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const province = e.target.value;
        setNewAddress({
            ...newAddress,
            province: province,
            district: '' 
        });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let addressToUse;
            if (selectedAddressId === 'new') {
                addressToUse = newAddress;
                
                // Save address for future use if checked
                if (saveForFuture) {
                    try {
                        await addAddress({
                            label: addressLabel,
                            ...newAddress
                        });
                    } catch (err) {
                        console.error("Failed to save address for future use:", err);
                        // We continue with the order even if saving for future fails
                    }
                }
            } else {
                const saved = savedAddresses.find(a => a.address_id === selectedAddressId);
                addressToUse = {
                    province: saved.province,
                    district: saved.district,
                    city: saved.city,
                    street_address: saved.street_address
                };
            }

            const orderResponse = await placeOrder({ 
                order_description: description,
                payment_method: paymentMethod,
                ...addressToUse
            });

            if (paymentMethod === 'esewa') {
                const orderId = orderResponse.order.order_id;
                const { payment_url, payment_data } = await initiateEsewaPayment(orderId);

                // Create and submit eSewa form
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = payment_url;

                for (const key in payment_data) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = payment_data[key];
                    form.appendChild(input);
                }

                document.body.appendChild(form);
                form.submit();
            } else {
                toast.success('Order placed successfully! Please pay on delivery.');
                clearCart();
                router.push('/profile/orders');
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return <div className={styles.container}>Your cart is empty.</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Finalize Your Order</h1>
            <div className={styles.layout}>
                <form onSubmit={handlePlaceOrder} className={styles.form}>
                    <div className={styles.section}>
                        <label>Delivery Instructions</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Please leave at the front door.."
                            required
                        />
                    </div>

                    <div className={styles.section}>
                        <label>Delivery Address</label>
                        
                        {savedAddresses.length > 0 && (
                            <div className={styles.addressGrid}>
                                {savedAddresses.map((addr) => (
                                    <div 
                                        key={addr.address_id}
                                        className={`${styles.savedAddressCard} ${selectedAddressId === addr.address_id ? styles.activeAddress : ''}`}
                                        onClick={() => setSelectedAddressId(addr.address_id)}
                                    >
                                        <span className={styles.addressLabel}>{addr.label}</span>
                                        <div className={styles.addressDetails}>
                                            {addr.street_address}, {addr.city}<br />
                                            {addr.district}, {addr.province}
                                        </div>
                                    </div>
                                ))}
                                <div 
                                    className={`${styles.savedAddressCard} ${selectedAddressId === 'new' ? styles.activeAddress : ''}`}
                                    onClick={() => setSelectedAddressId('new')}
                                >
                                    <span className={styles.addressLabel}>+ Use New Address</span>
                                    <div className={styles.addressDetails}>
                                        Enter a different delivery location
                                    </div>
                                </div>
                            </div>
                        )}

                        {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                            <div className={styles.newAddressForm}>
                                <div className={styles.saveAddressOption}>
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            checked={saveForFuture} 
                                            onChange={(e) => setSaveForFuture(e.target.checked)}
                                        />
                                        Save this address for future use
                                    </label>
                                    
                                    {saveForFuture && (
                                        <select 
                                            value={addressLabel} 
                                            onChange={(e) => setAddressLabel(e.target.value)}
                                            className={styles.labelSelect}
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    )}
                                </div>

                                <select value={newAddress.province} onChange={handleProvinceChange} required>
                                    <option value="">Select Province</option>
                                    {Object.keys(addressData).map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>

                                <select 
                                    value={newAddress.district} 
                                    onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                                    disabled={!newAddress.province}
                                    required
                                >
                                    <option value="">Select District</option>
                                    {newAddress.province && addressData[newAddress.province as keyof typeof addressData].map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>

                                <input 
                                    placeholder="City" 
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({...newAddress, city: e.target.value})} 
                                    required
                                />
                                
                                <input 
                                    placeholder="Street Address (Tole, House No.)" 
                                    value={newAddress.street_address}
                                    onChange={e => setNewAddress({...newAddress, street_address: e.target.value})} 
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.paymentSelection}>
                        <label>Select Payment Method</label>
                        <div className={styles.options}>
                            <label className={paymentMethod === 'esewa' ? styles.activeOption : ''}>
                                <input 
                                    type="radio" 
                                    value="esewa" 
                                    checked={paymentMethod === 'esewa'} 
                                    onChange={() => setPaymentMethod('esewa')}
                                />
                                Pay with eSewa
                            </label>
                            <label className={paymentMethod === 'cod' ? styles.activeOption : ''}>
                                <input 
                                    type="radio" 
                                    value="cod" 
                                    checked={paymentMethod === 'cod'} 
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                Cash on Delivery
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : paymentMethod === 'esewa' ? 'Pay with eSewa' : 'Place Order (COD)' }
                    </button>
                </form>

                <div className={styles.summary}>
                    <h3> Order Summary </h3>
                    <div className={styles.itemsList}>
                        {cart.items.map((item) => (
                            <div key={item.cart_item_id} className={styles.summaryItem}>
                                <span>{item.product_name} x {item.quantity}</span>
                                <span>Rs {item.subtotal}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.summaryTotal}>
                        <p>Total Items: {cart.total_items}</p>
                        <p className={styles.total}>Total Amount: Rs {cart.total_price}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}