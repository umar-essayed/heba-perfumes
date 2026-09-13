'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium block">
              محل هَيْبَة للعطور
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.2] text-white">
              عطور تفرض حضورك.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed max-w-xl">
              تشكيلة حصرية من 22 عطراً من أرقى الإبداعات العالمية والنيش، بتركيز زيوت عالية وثبات استثنائي. عاين عِطرك واستنشقه مع المندوب قبل الاستلام.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="py-3 px-6 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <span>تصفح الكل (22)</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/shop?category=men"
                className="py-3 px-4 rounded-xl border border-white/10 text-zinc-300 hover:text-[#C5A880] hover:border-[#C5A880]/40 text-xs sm:text-sm font-medium transition-all bg-[#121212]"
              >
                رجالي
              </Link>

              <Link
                href="/shop?category=women"
                className="py-3 px-4 rounded-xl border border-white/10 text-zinc-300 hover:text-rose-300 hover:border-rose-400/40 text-xs sm:text-sm font-medium transition-all bg-[#121212]"
              >
                حريمي
              </Link>

              <Link
                href="/shop?category=mix"
                className="py-3 px-4 rounded-xl border border-white/10 text-zinc-300 hover:text-amber-200 hover:border-amber-400/40 text-xs sm:text-sm font-medium transition-all bg-[#121212]"
              >
                ميكس
              </Link>
            </div>

            {/* Subtle Minimal Trust Line */}
            <div className="pt-6 border-t border-white/[0.07] flex flex-wrap items-center gap-6 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                معاينة واستنشاق قبل الدفع
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                ثبات يتجاوز 48 ساعة
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                توصيل لجميع محافظات مصر
              </span>
            </div>
          </div>

          {/* Real Photography Showcase */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#121212]">
              <Image
                src="/images/perfume-placeholder.jpeg"
                alt="عطر هيبة الفاخر"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 right-5 left-5 text-right">
                <span className="text-xs text-zinc-300 font-light block">الإصدار الملكي</span>
                <span className="text-sm font-bold text-white font-display">زجاجة هَيْبَة بالغطاء الكريستالي</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
