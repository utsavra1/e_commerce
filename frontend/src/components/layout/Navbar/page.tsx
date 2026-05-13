'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.wrapper}>
        <Link href="/" className={styles.logo}>E-SHOP</Link>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>
            🔍
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/shop" className={styles.linkItem}>SHOP</Link>
          
          {isAuthenticated ? (
            <div className={styles.userSection}>
              <span className={styles.username}>Hi, {user?.username}</span>
              <button onClick={logout} className={styles.logoutBtn}>LOGOUT</button>
            </div>
          ) : (
            <Link href="/login" className={styles.linkItem}>LOGIN</Link>
          )}

          <div className={styles.cartIcon}>
            <Link href="/cart" className={styles.cartIcon}>
            <span>🛒</span>
            <span className={styles.badge}>{cart?.total_items || 0}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}