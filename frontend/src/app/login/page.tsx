'use client'
import { loginUser } from "@/services/api";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'react-toastify';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try {
            const data = await loginUser({email, password});
            // data contains message, token, and user (from the backend response)
            login(data.token, data.user);
            toast.success("Welcome back!", { position: "top-center" });
            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
            
        } catch (err) {
            toast.error("Invalid credentials. Please try again.");
        }
    };

    return(
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    Welcome Back
                </h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            Email Address
                        </label>
                        <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>

                    <div className={styles.inputGroup}>
                    <label className={styles.label}>Password</label>
                    <div className={styles.passwordWrapper}>
                    <input 
                    type={showPassword ? "text" : "password"}  
                    className={styles.input} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    />
                    <button 
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "👁️" : "🚫"}
                    </button>
                    </div>
                    </div>
                    <button type="submit" className={styles.submitBtn}> Sign In</button>
                </form>
                <p className={styles.footerText}>
                Don't have an account? <Link href="/register" className={styles.link}>Create one</Link>
                </p>
            </div>
        </div>
    )
}