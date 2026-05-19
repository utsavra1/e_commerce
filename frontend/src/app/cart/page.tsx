'use client'

import styles from './page.module.css';
import { useCart } from "@/context/CartContext";
import Link from 'next/link';
import { CartItem } from '../../types/index';

export default function CartPage () {
    const {cart, updateItem, deleteItem, loading} = useCart();

    if(!cart || cart.items.length === 0 ){
        return(
            <div className={styles.emptyCart}>
                <h2>Your Cart is Empty</h2>
                <Link href="/" className={styles.shopBtn}> Start Shopping</Link>
            </div>
        );
    }

    return(
        <div className={styles.container}> 
        <h1 className={styles.title}>Your shopping Cart</h1>
            <div className={styles.layout}>
                <div className={styles.itemsList}>
                    {cart.items.map((item) => (
                        <div key={item.cart_item_id} className={styles.cartItem}>
                            <div className={styles.itemImage}>
                                {item.image ? (
                                    <img src={item.image} alt={item.product_name} />
                                ) : (
                                    <div className={styles.placeholder}>📱</div>
                                )}
                            </div>
                            <div className={styles.itemInfo}>
                                <h3>
                                    {item.product_name}
                                </h3>
                                <p className={styles.itemPrice}>
                                    Rs {item.price}
                                </p>
                            </div>
                            <div className={styles.controls}>
                                <div className={styles.quantity}>
                                    <button onClick={() => updateItem(item.cart_item_id, item.quantity -1)} disabled= {item.quantity <=1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateItem(item.cart_item_id, item.quantity +1)} >+</button>
                                </div>
                                <button onClick={() => deleteItem(item.cart_item_id)} className={styles.removeBtn}>Remove</button>
                            </div>
                            <p className={styles.subtotal}>Rs {item.subtotal}</p>
                        </div>
                    ))}
                    </div>
                        <div className={styles.summary}>
                            <h3>Summary</h3>
                            <div className={styles.summaryRow}>
                                <span>Total Items</span>
                                <span>{cart.total_items}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Total Price</span>
                                <span>Rs {cart.total_price}</span>
                        </div>
                        <Link href="/checkout" className={styles.checkoutBtn}>
                            Proceed to Checkout
                        </Link>
                </div>
            </div>
        </div>
    );
}