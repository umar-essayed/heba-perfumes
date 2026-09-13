'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Sparkles, CheckCircle2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { PerfumeProduct } from '@/types';
import { useCart } from '@/lib/context/CartContext';

interface ScentFinderProps {
  products: PerfumeProduct[];
}

export default function ScentFinder({ products }: ScentFinderProps) {
  const { addToCart } = useCart();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('fresh');

  const occasions = [
    { id: 'fresh', label: 'انتعاش بحري وفخامة صيفية 🌊', targetId: 'megamare' },
    { id: 'classic', label: 'شياكة وحضور يلفت الانتباه 🌿', targetId: 'sauvage' },
    { id: 'royal', label: 'عطر الأثرياء وفخامة راقية ✨', targetId: 'baccarat-rouge' },
    { id: 'sweet', label: 'تريند الفانيليا والكراميل 🍯', targetId: 'bianco-latte' },
    { id: 'warm', label: 'سهرة دافئة بطابع شرقي 🍷', targetId: 'khamrah' },
    { id: 'charm', label: 'جاذبية وجرأة رجالية 🍏', targetId: 'versace-eros' },
  ];

  const matchedOccasion = occasions.find(o => o.id === selectedOccasion) || occasions[0];
  const recommendedProduct = products.find(p => p.id === matchedOccasion.targetId) || products[0];

  return (
    <section id="scent-finder" className="py-20 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-y border-gold-500/20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-bold">
            <Compass className="w-4 h-4 text-gold-400" />
            <span>مساعد الهيبة الذكي لاختيار عطرك</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            مش متأكد تبدأ بإيه؟ <span className="gold-gradient-text">اختار هيبتك في خطوتين!</span>
          </h2>
          <p className="text-sm text-zinc-400">
            حدد مناسبتك أو المود اللي بتحبه من بين تشكيلة الـ 22 عطر، وإحنا هنطلعلك العطر اللي هيليق على شخصيتك بالظبط.
          </p>
        </div>

        {/* Interactive Selector Box */}
        <div className="max-w-4xl mx-auto bg-obsidian-950/80 border border-gold-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gold-300 mb-3 font-display">
                1. إيه المناسبة أو المود اللي بتدور عليه؟
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {occasions.map(occ => {
                  const isSelected = selectedOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 border-gold-400 text-white shadow-gold-sm'
                          : 'bg-obsidian-900 border-gold-500/15 text-zinc-400 hover:text-zinc-200 hover:border-gold-500/30'
                      }`}
                    >
                      <span className="text-xs font-bold">{occ.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommendation Result Card */}
            {recommendedProduct && (
              <div className="pt-6 border-t border-gold-500/20">
                <div className="text-xs font-bold text-gold-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>ترشيحنا اللي هيظبط معاك من أول رشة:</span>
                </div>

                <div className="bg-obsidian-900/90 border border-gold-500/30 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-gold-500/25 shrink-0 bg-obsidian-950">
                    <Image
                      src={recommendedProduct.image}
                      alt={recommendedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center md:text-right">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 text-[11px] font-bold border border-gold-400/30">
                      {recommendedProduct.badge || 'الأنسب لاختيارك'}
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display">
                      {recommendedProduct.name}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {recommendedProduct.story || recommendedProduct.description}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                      <span className="text-xl font-black text-gold-400 font-display">
                        {recommendedProduct.price} ج.م
                      </span>
                      {recommendedProduct.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                          {recommendedProduct.originalPrice} ج.م
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">
                        (حجم {recommendedProduct.sizes?.[0]?.size || '50 مل'})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => addToCart(
                        recommendedProduct,
                        recommendedProduct.sizes?.[0]?.size || '50 مل',
                        recommendedProduct.sizes?.[0]?.price || recommendedProduct.price,
                        1
                      )}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm hover:scale-105 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف هيبتك للسلة</span>
                    </button>
                    <Link
                      href={`/product/${recommendedProduct.id}`}
                      className="py-2.5 px-4 rounded-xl bg-obsidian-800 text-zinc-300 hover:text-white text-xs font-semibold text-center border border-gold-500/20 hover:bg-obsidian-700 transition-colors"
                    >
                      عرض تفاصيل أكتر
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
