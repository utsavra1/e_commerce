'use client';

import { useState, useEffect } from 'react';
import { Category, FilterParams } from '@/types';
import { fetchCategories } from '@/services/api';

interface FilterSidebarProps {
  filters: FilterParams;
  setFilters: React.Dispatch<React.SetStateAction<FilterParams>>;
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (categoryId: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: undefined // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (subcategoryId: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      subcategory_id: subcategoryId
    }));
  };

  const handlePriceChange = (min: string, max: string) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min || undefined,
      maxPrice: max || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: filters.search, // Keep search keyword
      sortBy: 'newest'
    });
  };

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-100 rounded w-1/2"></div>
    <div className="h-40 bg-gray-50 rounded"></div>
  </div>;

  const activeCategory = categories.find(c => c.category_id === filters.category_id);

  return (
    <div className="space-y-8 pr-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange(undefined)}
            className={`block text-sm font-bold transition-colors ${!filters.category_id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.category_id}
              onClick={() => handleCategoryChange(cat.category_id)}
              className={`block text-sm font-bold transition-colors ${filters.category_id === cat.category_id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories (Only show if a category is selected) */}
      {activeCategory && activeCategory.subcategories.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Specific To {activeCategory.category_name}</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleSubcategoryChange(undefined)}
              className={`block text-sm font-bold transition-colors ${!filters.subcategory_id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              All {activeCategory.category_name}
            </button>
            {activeCategory.subcategories.map(sub => (
              <button
                key={sub.subcategory_id}
                onClick={() => handleSubcategoryChange(sub.subcategory_id)}
                className={`block text-sm font-bold transition-colors ${filters.subcategory_id === sub.subcategory_id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {sub.subcategory_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handlePriceChange(e.target.value, filters.maxPrice || '')}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePriceChange(filters.minPrice || '', e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-3 px-4 bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
