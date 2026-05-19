'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/api';
import styles from '../login/page.module.css'; 
import { RegisterInput } from '@/types';
import { toast } from 'react-toastify';

export default function RegisterPage(){
    const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', dob: '' })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try {
            await registerUser(form);
            toast.success("Account created! Please sign in.");
            router.push('/login');
        } catch (err) {
            toast.error("Registration failed. Please check your details.");
        }
    };

    return(
        <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Join Us.</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          {/* Username Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username</label>
            <input 
              type="text" 
              className={styles.input} 
              required
              onChange={(e) => setForm({...form, username: e.target.value})} 
            />
          </div>

          {/* Email Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              required
              onChange={(e) => setForm({...form, email: e.target.value})} 
            />
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              required
              onChange={(e) => setForm({...form, password: e.target.value})} 
            />
          </div>

          {/* Phone Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number</label>
            <input 
              type="text" 
              className={styles.input} 
              required
              placeholder="10 digit number"
              onChange={(e) => setForm({...form, phone: e.target.value})} 
            />
          </div>

          {/* DOB Input - IMPORTANT: Backend expects YYYY-MM-DD */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Date of Birth</label>
            <input 
              type="date" 
              className={styles.input} 
              required
              onChange={(e) => setForm({...form, dob: e.target.value})} 
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Create Account</button>
        </form>
      </div>
    </div>
    )
}