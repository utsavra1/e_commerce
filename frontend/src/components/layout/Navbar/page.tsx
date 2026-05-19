'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  }

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
          
          {isAuthenticated ? (
            <div className={styles.userSection}>
              {user?.role === 'admin' && (
            <Link href="/admin" className={styles.linkItem}>ADMIN PANEL</Link>
                )}
              <span className={styles.username}>Hi, {user?.username}</span>
              <Link href="/profile" className={styles.avatarLink}>
                <div className={styles.avatar}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <Link href="/profile/orders" className={styles.linkItem}>MY ORDERS</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>LOGOUT</button>
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