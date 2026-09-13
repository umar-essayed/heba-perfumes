'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { EGYPT_GOVERNORATES } from '@/lib/data/initialProducts';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    isLoaded,
    subtotal,
    shippingZone,
    setShippingGovernorate,
    shippingCost,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    isFreeShipping,
    clearCart
  } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [governorate, setGovernorate] = useState(shippingZone.governorate);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay'>('cod');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Sync governorate with shippingZone
  useEffect(() => {
    if (shippingZone?.governorate) {
      setGovernorate(shippingZone.governorate);
    }
  }, [shippingZone]);

  const handleGovernorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGov = e.target.value;
    setGovernorate(newGov);
    setShippingGovernorate(newGov);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode.trim());
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('السلة فارغة. يرجى اختيار عطر قبل تأكيد الطلب.');
      return;
    }

    if (!fullName.trim()) {
      setFormError('يرجى إدخال الاسم بالكامل.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setFormError('يرجى إدخال رقم هاتف صحيح للتواصل وتأكيد الشحن.');
      return;
    }

    if (!city.trim()) {
      setFormError('يرجى كتابة المدينة أو الحي.');
      return;
    }

    if (!address.trim()) {
      setFormError('يرجى كتابة العنوان بالتفصيل.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          fullName,
          phone,
          secondaryPhone,
          governorate,
          city,
          address,
          notes
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          selectedSize: item.selectedSize,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        subtotal,
        shippingCost,
        discountAmount: appliedCoupon?.discountAmount || 0,
        couponCode: appliedCoupon?.code || null,
        total,
        paymentMethod,
        isGift,
        giftMessage: isGift ? giftMessage : null
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (data.success) {
        setCompletedOrder(data.data);
        clearCart();

        // Save order to localStorage for seamless live tracking
        try {
          if (typeof window !== 'undefined') {
            const existingSaved = localStorage.getItem('heba_my_orders');
            const myOrders = existingSaved ? JSON.parse(existingSaved) : [];
            const newOrderSummary = {
              id: data.data?.id || data.orderNumber,
              orderNumber: data.orderNumber || data.data?.orderNumber,
              createdAt: data.data?.createdAt || new Date().toISOString(),
              total: data.data?.total || total,
              customerName: fullName,
              phone: phone,
              governorate: governorate,
              itemsCount: items.length,
              firstItemName: items[0]?.name || 'عطر هيبة',
              status: data.data?.status || 'pending'
            };
            const updated = [
              newOrderSummary,
              ...myOrders.filter((o: any) => o.orderNumber !== newOrderSummary.orderNumber)
            ];
            localStorage.setItem('heba_my_orders', JSON.stringify(updated.slice(0, 10)));
          }
        } catch (e) {
          console.error('Error saving order to localStorage:', e);
        }
      } else {
        setFormError(data.error || 'حدث خطأ أثناء حفظ الطلب.');
      }
    } catch (err: any) {
      setFormError('تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (completedOrder) {
    const whatsappText = encodeURIComponent(
      `مرحباً، قمت بتسجيل طلب جديد برقم (${completedOrder.orderNumber}) باسم (${completedOrder.customer.fullName})، وأرغب في متابعة التوصيل.`
    );

    return (
      <div className="min-h-screen py-16 px-4 bg-[#0A0A0A]">
        <div className="max-w-xl mx-auto bg-[#121212] border border-white/10 rounded-2xl p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white font-display">
              تم تأكيد طلبك بنجاح
            </h1>
            <p className="text-xs text-zinc-400 font-light">
              شكراً لاختيارك هَيْبَة للعطور. سنقوم بتجهيز شحنتك فوراً.
            </p>
          </div>

          {/* Details */}
          <div className="bg-[#18181B] border border-white/[0.06] rounded-xl p-4 text-right space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-400">رقم الطلب:</span>
              <span className="font-bold text-white">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">الاسم:</span>
              <span className="text-zinc-200">{completedOrder.customer.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">العنوان:</span>
              <span className="text-zinc-200">
                {completedOrder.customer.governorate} - {completedOrder.customer.city}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/[0.06] pt-2 text-sm font-bold text-white">
              <span>المبلغ المطلوب عند الاستلام:</span>
              <span className="text-[#C5A880]">{completedOrder.total} ج.م</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/201003508854?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>متابعة الطلب عبر واتساب</span>
            </a>

            <Link
              href="/"
              className="py-3 px-5 rounded-lg border border-white/10 text-zinc-300 hover:text-white text-xs font-medium"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading view while hydrating from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen py-20 bg-[#0A0A0A] flex items-center justify-center text-xs text-zinc-400">
        جاري تحميل بيانات سلة المشتريات...
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen py-20 px-4 bg-[#0A0A0A] flex items-center justify-center">
        <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#C5A880]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-white">سلة المشتريات فارغة</h2>
            <p className="text-xs text-zinc-400 font-light">
              لم تقم بإضافة أي عطور إلى السلة حتى الآن. تصفح تشكيلة الـ 22 عطراً واطلب عطرك المفضل.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs transition-all shadow-md"
            >
              <span>تصفح قائمة العطور (22)</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white">الرئيسية</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
          <Link href="/shop" className="hover:text-white">المتجر</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-zinc-600" />
          <span className="text-zinc-200">إتمام الطلب</span>
        </nav>

        <div className="mb-8 text-right">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            إتمام الطلب
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-1">
            الدفع عند الاستلام مع إمكانية المعاينة والاستنشاق قبل دفع الحساب.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Customer Details Form */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            
            {/* Address */}
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-white/[0.06] pb-3 text-right">
                بيانات الشحن والتوصيل
              </h2>

              <div className="space-y-3.5 text-right">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">الاسم بالكامل:</label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم ثلاثي"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">رقم الموبايل:</label>
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">رقم بديل (اختياري):</label>
                    <input
                      type="tel"
                      placeholder="رقم آخر"
                      value={secondaryPhone}
                      onChange={e => setSecondaryPhone(e.target.value)}
                      className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">المحافظة:</label>
                    <select
                      value={governorate}
                      onChange={handleGovernorateChange}
                      className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov.governorate} value={gov.governorate}>
                          {gov.governorate} (شحن {gov.cost} ج)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">المدينة / الحي:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: المعادي، الدقي، سموحة..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">العنوان بالتفصيل:</label>
                  <input
                    type="text"
                    required
                    placeholder="الشارع، رقم العمارة، رقم الشقة، علامة مميزة"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">ملاحظات للمندوب (اختياري):</label>
                  <textarea
                    rows={2}
                    placeholder="أي ملاحظة تخص مواعيد التوصيل..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>
            </div>

            {/* Gift Options */}
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl p-5 space-y-3 text-right">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={e => setIsGift(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A880] rounded cursor-pointer"
                />
                <span>تغليف الطلب كهدية مع كارت إهداء مجاناً</span>
              </label>

              {isGift && (
                <textarea
                  rows={2}
                  placeholder="اكتب كلمات الإهداء هنا..."
                  value={giftMessage}
                  onChange={e => setGiftMessage(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl p-5 space-y-3 text-right">
              <span className="text-xs font-bold text-white block">طريقة الدفع:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-lg border text-right transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#C5A880] bg-white/5 text-white font-medium'
                      : 'border-white/10 text-zinc-400'
                  }`}
                >
                  <span className="text-xs font-bold block">الدفع عند الاستلام</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">عاين العطر مع المندوب واطمن</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-3 rounded-lg border text-right transition-colors ${
                    paymentMethod === 'instapay'
                      ? 'border-[#C5A880] bg-white/5 text-white font-medium'
                      : 'border-white/10 text-zinc-400'
                  }`}
                >
                  <span className="text-xs font-bold block">إنستاباي / محفظة</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">تحويل فوري قبل الشحن</span>
                </button>
              </div>

              {paymentMethod === 'instapay' && (
                <div className="p-3 bg-[#18181B] rounded-lg text-xs text-zinc-300 space-y-1">
                  <p>عنوان إنستاباي (IPA): <strong className="text-white font-mono">heba.perfumes@instapay</strong></p>
                  <p>رقم فودافون كاش / إنستاباي: <strong className="text-white font-mono">01003508854</strong></p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 rounded-lg bg-[#C5A880] hover:bg-[#D8BD97] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري تسجيل الطلب...</span>
              ) : (
                <>
                  <span>تأكيد الطلب الآن ({total} ج.م)</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl p-5 space-y-4 text-right">
              <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-3">
                ملخص الطلب ({items.length} عطور)
              </h3>

              <div className="max-h-56 overflow-y-auto space-y-3 divide-y divide-white/[0.06]">
                {items.map(item => (
                  <div key={item.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded overflow-hidden border border-white/10 shrink-0 bg-[#18181B]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-white truncate">{item.name}</h4>
                      <span className="text-[10px] text-zinc-400 block">{item.selectedSize} × {item.quantity}</span>
                    </div>
                    <span className="text-xs font-medium text-white shrink-0">
                      {item.price * item.quantity} ج.م
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="pt-2 border-t border-white/[0.06]">
                {appliedCoupon ? (
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>الكود: {appliedCoupon.code} (-{appliedCoupon.discountAmount} ج)</span>
                    <button onClick={removeCoupon} className="text-red-400 hover:underline">إلغاء</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#18181B] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs">
                      تطبيق
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[10px] mt-1 ${couponMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
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
                  <span>الشحن ({governorate}):</span>
                  <span>{isFreeShipping ? 'مجاني' : `${shippingCost} ج.م`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.06]">
                  <span>الإجمالي:</span>
                  <span className="text-[#C5A880] text-base">{total} ج.م</span>
                </div>
              </div>

              <div className="p-3 bg-[#18181B] rounded-lg text-[11px] text-zinc-400 space-y-1">
                <p className="font-medium text-zinc-300">حق المعاينة مكفول:</p>
                <p>يمكنك فتح الشحنة واستنشاق العطر مع المندوب قبل دفع المبلغ.</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
