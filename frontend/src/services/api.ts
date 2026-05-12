import { API_CONFIG } from "@/config/apiconfig";
import { ProductResponse, FilterParams, Product, AuthResponse } from "@/types";
import { LoginInput, RegisterInput } from "@/types";

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

export {fetchProducts, fetchProductById, registerUser, loginUser};