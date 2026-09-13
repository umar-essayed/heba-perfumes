'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PerfumeProduct } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface BestSellersSectionProps {
  products: PerfumeProduct[];
}

export default function BestSellersSection({ products }: BestSellersSectionProps) {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 6);

  return (
    <section className="py-16 sm:py-24 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#C5A880] font-medium block mb-1">
              مختارات خاصة
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              العطور الأكثر طلباً
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <span>تصفح كل الـ 22 عطراً</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid: 2 columns on mobile with staggered offset (one higher than the other) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 pb-12 [&>*:nth-child(even)]:translate-y-6 lg:[&>*:nth-child(even)]:translate-y-0">
          {bestSellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
