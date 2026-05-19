'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from "./page.module.css";
import { verifyEsewaPayment } from '@/services/api';
import { useCart } from '@/context/CartContext';


function SuccessContent () {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your payment...');
    const { refreshCart } = useCart();

     useEffect(() => {
        const verify = async () => {
            const data = searchParams.get('data');
            if (!data) {
                setStatus('error');
                setMessage('Invalid payment response from eSewa.');
                return;
            }
            try {
                await verifyEsewaPayment(data);
                setStatus('success');
                setMessage('Payment Successful! Your order is being processed.');
                await refreshCart();
            } catch (error) {
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Verification failed');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>
                    {status === 'loading' && '⏳'}
                    {status === 'success' && '✅'}
                    {status === 'error' && '❌'}
                </div>
                <h1>{status === 'success' ? 'Thank You!' : 'Payment Status'}</h1>
                <p>{message}</p>
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeBtn}>Continue Shopping</Link>
                    <Link href="/profile/orders" className={styles.orderBtn}>View My Orders</Link>
                </div>
            </div>
        </div>
    );

}
export default function SuccessPage (){
    return (
        <Suspense fallback={<div className={styles.container}>Loading payment status...</div>}>
            <SuccessContent />
        </Suspense>
    );
}