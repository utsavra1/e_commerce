'use client';

import styles from "./page.module.css"
import Link from "next/link";

export default function SuccessPage (){
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>🎉</div>
                <h1>Place your Order</h1>
                <p>Thank you for your purchase. Your premium electronics are on the way</p>
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeBtn}> Continue Shopping</Link>
                    <Link href="/profile/orders" className={styles.orderBtn}>View My Orders</Link>
                </div>
            </div>
        </div>
    )
}