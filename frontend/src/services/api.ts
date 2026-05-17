import { API_CONFIG } from "@/config/apiconfig";
import { 
    ProductResponse, FilterParams, Product, AuthResponse, Cart, 
    UpdateCartInput, PlaceOrderInput, CreateReviewInput, UpdateProfileInput, 
    Category, CreateProductInput, UpdateProductInput, Order, Review,
    RegisterInput, LoginInput, AddToCartInput 
} from "@/types";
import { User } from "@/types";


const BASE_URL = API_CONFIG.BASE_URL;

const getToken = () =>{
    if( typeof window !== 'undefined'){
        return localStorage.getItem('token');
    }
    return null;
}



const fetchProducts = async (page = 1, limit = 10, filters: FilterParams = {}): Promise<ProductResponse> => {
    const { search, minPrice, maxPrice, sortBy, category_id, subcategory_id } = filters;
    
    let url = `${BASE_URL}/products?page=${page}&limit=${limit}`;
    if(search) url += `&search=${encodeURIComponent(search)}`;
    if(minPrice) url += `&minPrice=${minPrice}`;
    if(maxPrice) url += `&maxPrice=${maxPrice}`;
    if(sortBy) url += `&sortBy=${sortBy}`;
    if(category_id) url += `&category_id=${category_id}`;
    if(subcategory_id) url += `&subcategory_id=${subcategory_id}`;
    
    const response = await fetch(url);
    if(!response.ok)
        throw new Error('Failed to fetch products');

    return response.json();
};

const fetchProductById = async (id: string | number): Promise<Product> =>{
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

const placeOrder = async (data: PlaceOrderInput): Promise<{message: string; order: Order}> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/orders/place`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
    }
    return response.json();
}

const fetchMyOrders = async (): Promise<Order[]> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/orders/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
     if (!response.ok) 
        throw new Error('Failed to fetch order details');
    return response.json();
}

const fetchOrderById = async (orderId: number): Promise<Order> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
     if (!response.ok) 
        throw new Error('Failed to fetch order details');
    return response.json();
}

const fetchReviewsByProductId = async (productId: number): Promise<Review[]> =>{
    const response = await fetch(`${BASE_URL}/reviews/${productId}`);
    if (!response.ok) 
        throw new Error('Failed to fetch reviews');
    return response.json();
}

const createReview = async (productId: number, data: CreateReviewInput): Promise<{message: string, review: Review}> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/reviews/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
    }
    return response.json();
}
const fetchUserProfile = async (): Promise<AuthResponse> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/profile/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) 
        throw new Error('Failed to fetch profile');
    return response.json();
};

const updateUserProfile = async (data: UpdateProfileInput): Promise<{ message: string; user: User }> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/profile/me`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
    }
    return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

const createAdminProduct = async (data: CreateProductInput): Promise<{message: string; product: Product}> =>{
    const token = getToken();
    const response = await fetch(`${BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
    }
    return response.json();
}

const deleteAdminProduct = async (productId: number): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE', // DELETE method for removing items
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
};

const updateAdminProduct = async (productId: number, data: UpdateProductInput): Promise<{ message: string; product: Product }> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
};

const createAdminCategory = async (name: string): Promise<Category> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category_name: name }),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
};

const deleteAdminCategory = async (id: number): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete category');
};

const fetchAdminOrders = async (): Promise<Order[]> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/admin/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error('Failed to fetch admin orders');
    return response.json();
};

export {
    fetchProducts,
    fetchProductById,
    registerUser,
    loginUser,
    fetchMyCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    placeOrder,
    fetchOrderById,
    fetchMyOrders,
    createReview,
    fetchReviewsByProductId,
    fetchUserProfile,
    updateUserProfile,
    fetchCategories,
    createAdminProduct,
    deleteAdminProduct,
    fetchAdminOrders,
    updateAdminProduct,
    createAdminCategory,
    deleteAdminCategory
};