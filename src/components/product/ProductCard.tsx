'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { PerfumeProduct } from '@/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: PerfumeProduct;
  onQuickView?: (product: PerfumeProduct) => void;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const currentSizeObj = product.sizes && product.sizes.length > 0
    ? product.sizes[selectedSizeIndex]
    : { size: '50 مل', price: product.price, originalPrice: product.originalPrice };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, currentSizeObj.size, currentSizeObj.price, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Gender classifications
  const isMen = product.gender === 'رجالي' || product.gender === 'رجال';
  const isWomen = product.gender === 'حريمي' || product.gender === 'نساء';
  const isMix = product.gender === 'الاتنين' || product.gender === 'للجنسين';

  // Distinct Card Styling per category
  let cardBorderClass = 'border-white/[0.08] hover:border-white/20';
  let cardBgClass = 'bg-[#121212]';
  let cardHoverGlow = 'hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8)]';

  if (isMen) {
    cardBorderClass = 'border-zinc-800/80 hover:border-[#C5A880]/40';
    cardBgClass = 'bg-[#111111]';
    cardHoverGlow = 'hover:shadow-[0_14px_34px_-8px_rgba(197,168,128,0.12)]';
  } else if (isWomen) {
    cardBorderClass = 'border-rose-950/40 hover:border-rose-300/40';
    cardBgClass = 'bg-gradient-to-b from-[#141012] to-[#111111]';
    cardHoverGlow = 'hover:shadow-[0_14px_34px_-8px_rgba(244,114,182,0.15)]';
  } else if (isMix) {
    // Blended dual aura for Unisex / Mix
    cardBorderClass = 'border-[#C5A880]/30 hover:border-rose-400/40';
    cardBgClass = 'bg-gradient-to-b from-[#161314] via-[#121113] to-[#101010]';
    cardHoverGlow = 'hover:shadow-[0_14px_36px_-6px_rgba(197,168,128,0.15),0_10px_26px_-6px_rgba(244,114,182,0.12)]';
  }

  return (
    <div
      className={`group flex flex-col ${cardBgClass} border ${cardBorderClass} rounded-2xl overflow-hidden transition-all duration-300 ${cardHoverGlow} ${className}`}
    >
      {/* Product Image & Edge Blending */}
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-[4/5] w-full overflow-hidden block bg-[#0D0D0D]"
      >
        {/* Category Ambient Backlight */}
        <div
          className={`absolute inset-0 z-0 opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none ${
            isMen
              ? 'bg-amber-800'
              : isWomen
              ? 'bg-rose-700'
              : 'bg-gradient-to-r from-amber-600 to-rose-600'
          }`}
        />

        {/* Main Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
        />

        {/* Soft Edge Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.6)] pointer-events-none z-10" />

        {/* Bottom Seamless Fade into Card Background */}
        <div
          className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t pointer-events-none z-10 ${
            isWomen
              ? 'from-[#141012] via-[#141012]/60 to-transparent'
              : isMix
              ? 'from-[#161314] via-[#161314]/60 to-transparent'
              : 'from-[#111111] via-[#111111]/60 to-transparent'
          }`}
        />

        {/* Category Pill Tag (No discount badge, clean luxury tag) */}
        <div className="absolute top-2.5 right-2.5 z-20">
          {isMen && (
            <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/30 shadow-sm">
              رجالي
            </span>
          )}
          {isWomen && (
            <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-rose-200 border border-rose-400/30 shadow-sm">
              حريمي
            </span>
          )}
          {isMix && (
            <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-100 border border-amber-400/40 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse"></span>
              ميكس | للجنسين
            </span>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Scent Guarantee Line */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 font-light">
            <span>{isMix ? 'توليفة مشتركة' : isMen ? 'فوحان رجالي' : 'أنوثة راقية'}</span>
            <span className="text-zinc-500">ثبات 48 ساعة</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-white">
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-zinc-100 font-display hover:text-[#C5A880] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description (only on tablet/desktop to keep mobile 2-col clean) */}
          <p className="hidden sm:line-clamp-2 text-xs text-zinc-400 mt-1 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Sizes Selector */}
        {product.sizes && product.sizes.length > 1 && (
          <div className="flex items-center gap-1 pt-2 border-t border-white/[0.05]">
            {product.sizes.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSizeIndex(idx);
                }}
                className={`text-[9px] sm:text-[11px] px-2 py-0.5 rounded transition-all ${
                  selectedSizeIndex === idx
                    ? isMen
                      ? 'bg-[#C5A880]/20 text-[#C5A880] font-medium border border-[#C5A880]/30'
                      : isWomen
                      ? 'bg-rose-500/20 text-rose-200 font-medium border border-rose-400/30'
                      : 'bg-white/20 text-white font-medium border border-white/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/[0.05]">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-bold text-white font-display">
              {currentSizeObj.price}
            </span>
            <span className="text-[10px] text-zinc-400">ج.م</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : isMix
                ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-[#C5A880] hover:to-rose-400 hover:text-black text-white border border-white/10'
                : isWomen
                ? 'bg-rose-950/50 hover:bg-rose-300 hover:text-black text-white border border-rose-500/20'
                : 'bg-white/10 hover:bg-[#C5A880] hover:text-black text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">أضيف</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>أضف</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
