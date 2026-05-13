import { API_CONFIG } from "@/config/apiconfig";
import { ProductResponse, FilterParams, Product, AuthResponse, Cart, UpdateCartInput } from "@/types";
import { LoginInput, RegisterInput, AddToCartInput } from "@/types";
import { get } from "http";
import { json } from "stream/consumers";

const BASE_URL = API_CONFIG.BASE_URL;

const getToken = () =>{
    if( typeof window !== undefined){
        return localStorage.getItem('token');
    }
    return null;
}



const fetchProducts = async (page = 1, limit = 10, filters: FilterParams = {}): Promise<ProductResponse> => {
    const { search, minPrice, maxPrice, sortBy } = filters;
    
    let url = `${BASE_URL}/products?page=${page}&limit=${limit}`;
    if(search)
        url += `&search=${search}`;
    if(minPrice)
        url += `&minPrice${minPrice}`;
    if (maxPrice) 
        url += `&maxPrice=${maxPrice}`;
    if (sortBy) 
        url += `&sortBy=${sortBy}`;

    const response = await fetch(url);
    if(!response.ok)
        throw new Error('Failed to fetch products');

    return response.json();

};

const fetchProductById = async (id: string): Promise<Product> =>{
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if(!response.ok)
        throw new Error('Product not found');
    return response.json();
}

const registerUser = async (data: RegisterInput) =>{
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if(!response.ok)
        throw new Error('Registration failed');

    return response.json();
}

const loginUser = async (data: LoginInput): Promise<AuthResponse> =>{
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if(!response.ok)
        throw new Error('Login failed');

    return response.json();
}

const fetchMyCart = async(): Promise<Cart> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/cart/my`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) 
        throw new Error('Failed to fetch cart');
    return response.json();
}

const addToCart = async(data: AddToCartInput): Promise<{message: string; item: any }> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to cart');
    }
    return response.json();
}

const updateCartItem = async(cartItemId: number, quantity: number): Promise<{message: string; item: any}> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/cart/update/${cartItemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({quantity}),
    });
    if (!response.ok) 
        throw new Error('Failed to update cart');
    return response.json();
}

const deleteCartItem = async(cartItemId: number): Promise<{message: string}> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/cart/delete/${cartItemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
     if (!response.ok) 
        throw new Error('Failed to delete cart');
    return response.json();
}

export {fetchProducts, fetchProductById, registerUser, loginUser, fetchMyCart, addToCart, updateCartItem, deleteCartItem};