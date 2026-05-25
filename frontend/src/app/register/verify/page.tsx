'use client';

import {useState, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOTP } from '@/services/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import styles from '../page.module.css';

function VerifyContent () {
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {login} = useAuth();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = await verifyOTP(email!, otp);
            login(data.token, data.user);
            toast.success("Email verified! Welcome.");
            router.push('/');
            
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Invalid OTP.");
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Verify Email</h1>
                <p style={{ marginBottom: '20px', color: '#6b7280' }}>
                    Enter the 6-digit code sent to <strong>{email}</strong>
                </p>
                <form className={styles.form} onSubmit={handleVerify}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text" 
                            className={styles.input}
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            placeholder="000000"
                            maxLength={6}
                            required 
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
