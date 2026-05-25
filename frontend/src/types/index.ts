export interface Product {
  product_id: number;
  product_name: string;
  product_description: string;
  product_price: string;
  stock: number;
  posters?: { url: string; is_main: boolean }[];
  subcategory?: Subcategory;
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
  category_id?: number;
  subcategory_id?: number;
}

export interface Category {
  category_id: number;
  category_name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  subcategory_id: number;
  subcategory_name: string;
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

export interface LoginInput {
  email: string;
  password: string;
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

export interface OrderItem {
  order_item_id: number;
  price: number;
  quantity: number;
  subtotal?: number; 
  product: {
    product_name: string;
  };
}

export interface Order {
  order_id: number;
  order_date: number;
  order_description: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  province: string;
  district: string;
  city: string;
  street_address: string;
  orderitem: OrderItem[];
  user?: {
    username: string;
    email: string;
  };
}

export interface PlaceOrderInput {
  order_description: string;
  payment_method: 'esewa' | 'cod';
  province: string;
  district: string;
  city: string;
  street_address: string;
}
export interface Review {
  review_id: number;
  rating: number;
  comments: string;
  user: {
    username: string;
  };
}
export interface CreateReviewInput {
  rating: number;
  comments: string;
}

export interface ReviewResponse {
  product_name: string;
  total_reviews: number;
  average_rating: number;
  reviews: Review[];
}

export interface UpdateProfileInput {
  username?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

export interface CreateProductInput {
  product_name: string;
  product_description: string;
  product_price: number;
  stock: number;
  subcategory_id: number;
  product_image?: string;
}

export interface UpdateProductInput {
  product_name?: string;
  product_description?: string;
  product_price?: number;
  stock?: number;
  subcategory_id?: number;
  product_image?: string;
}