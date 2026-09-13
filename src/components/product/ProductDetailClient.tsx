'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Gift,
  ChevronRight,
  ArrowLeft,
  Share2,
  Copy,
  MessageCircle
} from 'lucide-react';
import { PerfumeProduct } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import ProductCard from '@/components/product/ProductCard';

interface ProductDetailClientProps {
  product: PerfumeProduct;
  relatedProducts: PerfumeProduct[];
}

export default function ProductDetailClient({
  product,
  relatedProducts
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isGiftMode, setIsGiftMode] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [shareToast, setShareToast] = useState(false);

  const currentSizeObj =
    product.sizes && product.sizes.length > 0
      ? product.sizes[selectedSizeIndex]
      : { size: '50 مل', price: product.price, originalPrice: product.originalPrice };

  const handleAddToCart = () => {
    addToCart(product, currentSizeObj.size, currentSizeObj.price, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, currentSizeObj.size, currentSizeObj.price, 1);
    router.push('/checkout');
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    // Share text explicitly EXCLUDES the price as requested
    const shareData = {
      title: `${product.name} | عطور هَيْبَة`,
      text: `${product.name} - ${product.description}`,
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    // Fallback: Copy link to clipboard and show feedback toast
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 3000);
      } catch (e) {
        // Fallback prompt
        window.prompt('انسخ رابط العطر:', shareUrl);
      }
    }
  };

  const isMen = product.gender === 'رجالي' || product.gender === 'رجال';
  const isWomen = product.gender === 'حريمي' || product.gender === 'نساء';
  const isMix = product.gender === 'الاتنين' || product.gender === 'للجنسين';

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Share Button */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <nav className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
            <Link href="/shop" className="hover:text-white transition-colors">المتجر</Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
            <span className="text-zinc-200 line-clamp-1">{product.name}</span>
          </nav>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[#141414] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-all shadow-sm"
            title="مشاركة العطر"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>مشاركة العطر</span>
          </button>
        </div>

        {/* Share Toast Notification */}
        {shareToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#161616] border border-[#C5A880]/40 text-white py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">تم نسخ رابط العطر بنجاح!</p>
              <p className="text-zinc-400 text-[11px]">يمكنك الآن مشاركته في أي محادثة أو ستوري</p>
            </div>
          </div>
        )}

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start mb-20">
          
          {/* Image & Ambient Edge Blend */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] shadow-2xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Edge Vignette & Ambient Blend */}
              <div className="absolute inset-0 shadow-[inset_0_0_35px_rgba(0,0,0,0.6)] pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent pointer-events-none" />

              {/* Category Pill */}
              <div className="absolute top-4 right-4 z-10">
                {isMen && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/30 shadow-md">
                    رجالي
                  </span>
                )}
                {isWomen && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-rose-200 border border-rose-400/30 shadow-md">
                    حريمي
                  </span>
                )}
                {isMix && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-100 border border-amber-400/40 shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse" />
                    ميكس | للجنسين
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6 space-y-6 text-right">
            
            <div className="border-b border-white/[0.08] pb-6">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium block mb-2">
                عطور هَيْبَة • ثبات يتجاوز 48 ساعة
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
                {product.name}
              </h1>

              {/* Clean Price Display (no discount badge) */}
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {currentSizeObj.price}
                </span>
                <span className="text-sm text-zinc-400 font-light">جنيه مصري</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-sm text-zinc-300 font-light leading-relaxed">
              <p>{product.description}</p>
              {product.story && (
                <p className="text-xs text-zinc-400 border-r-2 border-[#C5A880] pr-3 italic">
                  {product.story}
                </p>
              )}
            </div>

            {/* Fragrance Notes Pills */}
            {product.fragranceNotes && (
              <div className="space-y-3 pt-2">
                <span className="text-xs text-zinc-400 font-medium block">النوتات العطرية الأساسية:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...(product.fragranceNotes.top || []),
                    ...(product.fragranceNotes.heart || []),
                    ...(product.fragranceNotes.base || [])
                  ].map((note, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#141414] border border-white/[0.08] px-3 py-1.5 rounded-xl text-zinc-300"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs text-zinc-400 font-medium block">اختر الحجم:</span>
                <div className="flex gap-2.5">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        selectedSizeIndex === idx
                          ? 'bg-white text-black font-semibold shadow-md'
                          : 'bg-[#141414] text-zinc-400 hover:text-white border border-white/[0.08]'
                      }`}
                    >
                      {s.size} ({s.price} ج.م)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gift Options */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={isGiftMode}
                  onChange={e => setIsGiftMode(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A880] rounded cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#C5A880]" />
                  إضافة تغليف هدايا كرافت فاخر وكارت إهداء مجاناً
                </span>
              </label>

              {isGiftMode && (
                <textarea
                  placeholder="اكتب كلمات الإهداء هنا لطباعتها في الكارت..."
                  value={giftNote}
                  onChange={e => setGiftNote(e.target.value)}
                  rows={2}
                  className="mt-2 w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                />
              )}
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تمت الإضافة للسلة</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف للسلة</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>شراء الآن (دفع عند الاستلام)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Share & Quick Guarantees */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/[0.05] font-light gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  معاينة واستنشاق قبل الدفع
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                  شحن سريع لجميع محافظات مصر
                </span>
                <button
                  onClick={handleShare}
                  className="hover:text-white flex items-center gap-1 text-[#C5A880] transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  <span>مشاركة الرابط</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-white/[0.07] space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white text-right">
              عطور أخرى قد تروق لك
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map(relProduct => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
