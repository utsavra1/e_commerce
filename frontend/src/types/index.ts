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