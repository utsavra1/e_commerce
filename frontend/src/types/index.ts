export interface Product {
  product_id: number;
  product_name: string;
  product_description: string;
  product_price: string;
  stock: number;
  posters?: { url: string; is_main: boolean }[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  phone: string;
  dob: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
}

export interface CartItem {
  cart_item_id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Cart {
  cart_id: number;
  total_items: number;
  total_price: number;
  items: CartItem[];
}

export interface AddToCartInput {
  product_id: number;
  quantity: number;
}

export interface UpdateCartInput {
  quantity: number;
}

export interface LoginInput {
  email: string;
  password: string;
}