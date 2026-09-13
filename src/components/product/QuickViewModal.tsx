'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, ShieldCheck, ArrowLeft } from 'lucide-react';
import { PerfumeProduct } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import FragranceNotesPyramid from './FragranceNotesPyramid';

interface QuickViewModalProps {
  product: PerfumeProduct;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const currentSizeObj = product.sizes && product.sizes.length > 0
    ? product.sizes[selectedSizeIndex]
    : { size: '50 مل', price: product.price, originalPrice: product.originalPrice };

  const handleAddToCart = () => {
    addToCart(product, currentSizeObj.size, currentSizeObj.price, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl bg-obsidian-900 border border-gold-500/30 rounded-3xl shadow-2xl shadow-gold-500/10 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-obsidian-950/80 border border-gold-500/20 text-zinc-400 hover:text-white hover:bg-obsidian-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto bg-obsidian-950 p-6 flex items-center justify-center">
            <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 md:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold mr-1">{product.rating}</span>
                </div>
                <span className="text-zinc-500 text-xs">({product.reviewsCount} تقييم راضي)</span>
                {product.badge && (
                  <span className="text-[11px] font-bold text-obsidian-950 bg-gold-400 px-2.5 py-0.5 rounded-full mr-auto">
                    {product.badge}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white font-display">
                {product.name}
              </h3>
              <p className="text-xs text-gold-400 font-semibold mt-1">
                {product.tagline}
              </p>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Scent Pyramid */}
            {product.fragranceNotes && (
              <FragranceNotesPyramid notes={product.fragranceNotes} />
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">اختر الحجم المناسب:</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-xl border text-right transition-all ${
                        selectedSizeIndex === idx
                          ? 'border-gold-400 bg-gold-500/10 text-white shadow-sm'
                          : 'border-gold-500/15 bg-obsidian-950/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.size}</div>
                      <div className="text-xs font-black text-gold-400 mt-1">{s.price} ج.م</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Add to Cart */}
            <div className="pt-4 border-t border-gold-500/15 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gold-400 font-display">
                  {currentSizeObj.price} ج.م
                </span>
                {currentSizeObj.originalPrice && (
                  <span className="text-xs text-zinc-500 line-through">
                    {currentSizeObj.originalPrice} ج.م
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-semibold mr-auto">
                  متوفر جاهز للشحن الفوري 🚀
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 shadow-gold-sm hover:scale-[1.02]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>اتضافت للسلة بنجاح! 👑</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>أضف للسلة دلوقتي</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-xs text-gold-400/80 hover:text-gold-300 underline font-medium"
                >
                  عرض تفاصيل العطر والتقييمات الكاملة
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
