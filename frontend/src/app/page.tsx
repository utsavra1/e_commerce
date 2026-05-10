'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from '@/services/api';
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function Home () {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
    .then((data) =>{
      setProducts(data.products);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if(loading)
    return <div className="flex justify-center items-center h-screen">Loading Store...</div>;

  return(
    <main className="max-w-7xl mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">
          Featured Products
        </h1>
        <p className="text-gray-600 mt-2"> 
          Discover our latest arrival 
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </main>
  );
}

