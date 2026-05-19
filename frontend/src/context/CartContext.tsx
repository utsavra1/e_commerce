'use client';

import React, {createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback} from "react";
import { Cart } from "@/types";
import { fetchMyCart, updateCartItem as apiUpdateCartItem, deleteCartItem as apiDeleteCartItem, addToCart as apiAddToCart} from "@/services/api";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';

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

    const refreshCart = useCallback(async() =>{
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
    }, [isAuthenticated]);

    useEffect(() =>{
        refreshCart();
    }, [refreshCart]);

    const addItem = useCallback(async(productId: number, quantity: number) =>{
        if (!isAuthenticated) {
            toast.warning('Please login to add items to cart', { position: 'top-center' });
            return;
        }
        try {
            await apiAddToCart({product_id: productId, quantity});
            toast.success('Item added to cart', { position: 'bottom-right' });
            await refreshCart();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
        }
    }, [refreshCart, isAuthenticated]);

    const updateItem = useCallback(async(cartItemId: number, quantity: number) =>{
        try {
            await apiUpdateCartItem(cartItemId, quantity);
            await refreshCart();
        } catch (error) {
             toast.error(error instanceof Error ? error.message : 'Failed to update cart');
        }
    }, [refreshCart]);

    const deleteItem = useCallback(async(cartItemID: number) =>{
        try {
            await apiDeleteCartItem(cartItemID);
            await refreshCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    }, [refreshCart]);

    const value = useMemo(() => ({
        cart,
        loading,
        addItem,
        updateItem,
        deleteItem,
        refreshCart
    }), [cart, loading, addItem, updateItem, deleteItem, refreshCart]);

    return(
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};