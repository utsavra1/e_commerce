import { ProductResponse, FilterParams } from "@/types";

const BASE_URL = 'http://localhost:3000';

 /**
 * Fetches all products from the backend with optional pagination.
 * @param page The page number to fetch (default is 1)
 * @param limit How many products to show per page (default is 10)
 */

export const fetchProducts = async (page = 1, limit = 10, filters: FilterParams = {}): Promise<ProductResponse> => {
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