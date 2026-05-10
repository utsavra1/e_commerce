'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from '@/services/api';
import { FilterParams, Product } from "@/types";
import Navbar from "@/layout/Navbar";
import ProductCard from "@/components/Products/ProductCard";

export default function Home () {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({sortBy: 'newest'});

  useEffect(() => {
    setLoading(true);
    fetchProducts(1, 12, filters)
    .then((data) =>{
      setProducts(data.products);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [filters]);

  if(loading)
    return <div className="flex justify-center items-center h-screen">Loading Store...</div>;

  return(
     <div className="min-h-screen bg-white selection:bg-indigo-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header with Sort Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
              Premium <span className="text-indigo-600">Electronics</span> Collection.
            </h1>
            <p className="text-gray-500 font-medium">
              Explore the next generation of gadgets and accessories curated for your digital lifestyle.
            </p>
          </div>
          
          <select 
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-gray-50 border-none rounded-2xl px-6 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-gray-50 h-[400px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

