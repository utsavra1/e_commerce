import { ProductResponse } from "@/types";



const BASE_URL = 'http://localhost:3000';

 /**
 * Fetches all products from the backend with optional pagination.
 * @param page The page number to fetch (default is 1)
 * @param limit How many products to show per page (default is 10)
 */

export const fetchProducts = async (page: number = 1, limit: number = 10): Promise<ProductResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/products?page=${page}&limit=${limit}`);
        if (!response.ok) {
            // This will catch 401, 404, 500 etc.
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data: ProductResponse = await response.json();
        return data;
        
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error; 
    }
}