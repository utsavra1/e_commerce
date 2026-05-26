'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/api';
import styles from './page.module.css'; 
import { RegisterInput } from '@/types';
import { toast } from 'react-toastify';

export default function RegisterPage(){
    const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', dob: '' })
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setSubmitting(true);
        try {
            await registerUser(form);
            toast.info("OTP sent to your email!");
            router.push(`/register/verify?email=${encodeURIComponent(form.email)}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Registration failed. Please check your details.");
        } finally{
            setSubmitting(false);
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
            <div className={styles.passwordWrapper}>
              <input 
                  type={showPassword ? "text" : "password"} 
                  className={styles.input} 
                  required
                  onChange={(e) => setForm({...form, password: e.target.value})} 
              />
              <button 
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
              >
                  {showPassword ? "👁️" : "🚫"}
              </button>
            </div>
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

            {/* Date of Birth Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Date of Birth</label>
            <input 
              type="date" 
              className={styles.input} 
              required
              onChange={(e) => setForm({...form, dob: e.target.value})} 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
    )
}