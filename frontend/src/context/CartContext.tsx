'use client';

import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import { Cart } from "@/types";
import { fetchMyCart, updateCartItem as apiUpdateCartItem, deleteCartItem as apiDeleteCartItem, addToCart as apiAddToCart} from "@/services/api";
import { useAuth } from "./AuthContext";
import { authenticate } from '../../../Backend/src/middleware/auth';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addItem: (productId: number, quantity: number) => Promise<void>;
    updateItem: (cartItemId: number, quantity: number) => Promise<void>;
    deleteItem: (cartItemId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined> (undefined);

export const CartProvider = ({ children }: {children: ReactNode}) =>{
    const [cart, setCart] = useState<Cart | null >(null);
    const [loading, setLoading] = useState(false);
    const {isAuthenticated } = useAuth();

    const refreshCart = async() =>{
        if(!isAuthenticated){
            setCart(null);
            return;
        }
        setLoading(true);
        try {
            const data = await fetchMyCart();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() =>{
        refreshCart();
    }, [isAuthenticated]);

    const addItem = async(productId: number, quantity: number) =>{
        try {
            await apiAddToCart({product_id: productId, quantity});
            await refreshCart();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add to cart');
        }
    };

    const updateItem = async(cartItemId: number, quantity: number) =>{
        try {
            await apiUpdateCartItem(cartItemId, quantity);
            await refreshCart();
        } catch (error) {
             alert(error instanceof Error ? error.message : 'Failed to update cart');
        }
    };

    const deleteItem = async(cartItemID: number) =>{
        try {
            await apiDeleteCartItem(cartItemID);
            await refreshCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return(
        <CartContext.Provider value={{ cart, loading, addItem, updateItem, deleteItem, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};