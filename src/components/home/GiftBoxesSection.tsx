import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GiftBoxesSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#121212] border border-white/[0.07] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Details */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-5 text-right">
            <span className="text-xs uppercase tracking-wider text-[#C5A880] font-medium block">
              خدمة خاصة
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              تهادي بفخامة تليق بك.
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              نوفر خدمة تغليف الهدايا في صناديق كرافت أنيقة مع كارت إهداء يُكتب باسمك وكلماتك الخاصة، مجاناً مع أي عطر تختاره من تشكيلة الـ 22 عطراً.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-white/10 hover:bg-[#C5A880] hover:text-black text-white text-xs font-medium transition-all"
              >
                <span>اختر عطرك الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto lg:h-full min-h-[300px]">
            <Image
              src="/images/perfume-placeholder.jpeg"
              alt="تغليف عطور هيبة"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
