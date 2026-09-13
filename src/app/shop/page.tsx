'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import ProductCard from '@/components/product/ProductCard';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  React.useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Category Tabs strictly matching user's taxonomy
  const categories = [
    { id: 'all', name: 'الكل', count: INITIAL_PRODUCTS.length },
    {
      id: 'men',
      name: 'رجالي',
      count: INITIAL_PRODUCTS.filter(p => p.gender === 'رجالي' || p.gender === 'رجال').length,
    },
    {
      id: 'women',
      name: 'حريمي',
      count: INITIAL_PRODUCTS.filter(p => p.gender === 'حريمي' || p.gender === 'نساء').length,
    },
    {
      id: 'mix',
      name: 'ميكس (الاتنين)',
      count: INITIAL_PRODUCTS.filter(p => p.gender === 'الاتنين' || p.gender === 'للجنسين').length,
    },
  ];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(product => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      let matchesCategory = true;
      if (selectedCategory === 'men') {
        matchesCategory = product.gender === 'رجالي' || product.gender === 'رجال';
      } else if (selectedCategory === 'women') {
        matchesCategory = product.gender === 'حريمي' || product.gender === 'نساء';
      } else if (selectedCategory === 'mix') {
        matchesCategory = product.gender === 'الاتنين' || product.gender === 'للجنسين';
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="mb-8 text-right">
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium block mb-2">
            تشكيلة هَيْبَة للعطور
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            قائمة العطور الكاملة
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 max-w-xl">
            22 عطراً عالمياً ونيش بتركيز عالي وثبات يتجاوز 48 ساعة، مع إمكانية المعاينة والتجربة قبل الدفع.
          </p>
        </div>

        {/* Filter Bar: Clean category tabs + streamlined search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.06]">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? cat.id === 'women'
                        ? 'bg-rose-950/70 text-rose-200 border border-rose-400/50 shadow-sm'
                        : cat.id === 'mix'
                        ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-200 border border-amber-400/40 shadow-sm'
                        : cat.id === 'men'
                        ? 'bg-[#1a1714] text-[#C5A880] border border-[#C5A880]/40 shadow-sm'
                        : 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-[#121212] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-current' : 'bg-white/[0.06] text-zinc-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث باسم العطر..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>

        </div>

        {/* Products Grid: 2 columns on mobile with staggered offset (one higher than the other), 3-4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pb-12 [&>*:nth-child(even)]:translate-y-6 md:[&>*:nth-child(even)]:translate-y-0">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-zinc-500 text-sm">
            لم يتم العثور على أي عطر يطابق بحثك.
          </div>
        )}

      </div>
    </div>
  );
}
