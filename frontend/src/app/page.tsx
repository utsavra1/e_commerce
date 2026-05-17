'use client';

import { useEffect, useState, Suspense } from "react";
import { fetchProducts } from '@/services/api';
import { FilterParams, Product } from "@/types";
import ProductCard from "@/components/Products/ProductCard";
import FilterSidebar from "@/components/Products/FilterSidebar";
import { useSearchParams } from "next/navigation";

function HomeContent () {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterParams>({
    sortBy: searchParams.get('sortBy') || 'newest',
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
    subcategory_id: searchParams.get('subcategory_id') ? Number(searchParams.get('subcategory_id')) : undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
  });

  useEffect(() =>{
    const query = searchParams.get('search') || '';
    setFilters(prev => ({...prev, search: query}));
  }, [searchParams]);

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

  return(
     <div className="min-h-screen bg-white selection:bg-indigo-100">
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
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-gray-50 border-none rounded-2xl px-6 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-gray-50 h-[400px] rounded-3xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-400">No products found matching your criteria.</h2>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Store...</div>}>
        <HomeContent />
      </Suspense>
    </div>
  );
}

