'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    isFreeShipping,
    amountNeededForFreeShipping
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    setCouponMsg(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#121212] border-r border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-base font-bold text-white font-display">
                سلة المشتريات ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-4 border-b border-white/[0.06] bg-[#18181B] text-xs">
            {isFreeShipping ? (
              <span className="text-emerald-400 font-medium block">
                حصلت على شحن مجاني للطلب!
              </span>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>باقي <strong className="text-white">{amountNeededForFreeShipping} ج</strong> للشحن المجاني</span>
                  <span>900 ج</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A880] transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 900) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-white/[0.06]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-10 h-10 text-zinc-600 stroke-[1]" />
                <h3 className="text-base font-medium text-white">سلتك فارغة</h3>
                <p className="text-xs text-zinc-500 max-w-xs">
                  تصفح تشكيلة العطور وأضف ما يناسب ذوقك.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
                >
                  تصفح العطور
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-[#18181B]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-white font-display line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-light block mt-0.5">
                        الحجم: {item.selectedSize}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-white/10 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#0A0A0A] space-y-4">
              {/* Coupon */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs text-zinc-300 bg-white/5 p-2 rounded-lg">
                    <span>كود الخصم: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountAmount} ج)</span>
                    <button onClick={removeCoupon} className="text-red-400 hover:underline">إلغاء</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#18181B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium"
                    >
                      تطبيق
                    </button>
                  </form>
                )}
                {couponMsg && <p className="text-[11px] text-zinc-400 mt-1">{couponMsg}</p>}
              </div>

              {/* Subtotal & Total */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>المجموع الفرعي:</span>
                  <span className="text-white">{subtotal} ج.م</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>الخصم:</span>
                    <span>-{appliedCoupon.discountAmount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>الشحن:</span>
                  <span>{isFreeShipping ? 'مجاني' : 'يُحسب عند الدفع'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>المجموع:</span>
                  <span className="text-[#C5A880] text-base">
                    {Math.max(0, subtotal - (appliedCoupon?.discountAmount || 0))} ج.م
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 rounded-lg bg-[#C5A880] hover:bg-[#D8BD97] text-black font-bold text-xs text-center flex items-center justify-center gap-2 transition-all"
              >
                <span>متابعة الشراء (الدفع عند الاستلام)</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
