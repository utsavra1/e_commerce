import styles from './page.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <h2 className={styles.title}>E-SHOP</h2>
          <p className={styles.text}>Providing the best quality electronics with a focus on innovation and customer satisfaction.</p>
        </div>
        
        <div>
          <h3 className={styles.title}>Shop</h3>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}><a href="#" className={styles.link}>All Products</a></li>
            <li className={styles.linkItem}><a href="#" className={styles.link}>Featured</a></li>
          </ul>
        </div>

        <div>
          <h3 className={styles.title}>Support</h3>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}><a href="#" className={styles.link}>Contact</a></li>
            <li className={styles.linkItem}><a href="#" className={styles.link}>Shipping</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>© 2026 E-SHOP. All rights reserved.</div>
    </footer>
  );
}