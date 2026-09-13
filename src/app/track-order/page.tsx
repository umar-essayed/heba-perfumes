'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  MessageCircle,
  Phone,
  ShieldCheck,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

interface SavedOrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  customerName: string;
  phone: string;
  governorate?: string;
  itemsCount: number;
  firstItemName: string;
  status: OrderStatus;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('order') || searchParams.get('phone') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [multipleOrders, setMultipleOrders] = useState<Order[]>([]);
  const [savedOrders, setSavedOrders] = useState<SavedOrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Load saved orders from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('heba_my_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedOrders(parsed);
            // If no search query in URL, auto-track the most recent saved order
            if (!initialQuery && parsed[0]?.orderNumber) {
              setSearchQuery(parsed[0].orderNumber);
              fetchOrder(parsed[0].orderNumber);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved orders:', e);
    }
  }, []);

  // 2. Fetch order by orderNumber or phone
  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    setMultipleOrders([]);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data.success && data.data) {
        setOrder(data.data);
        if (data.multiple && data.multiple.length > 1) {
          setMultipleOrders(data.multiple);
        }
      } else {
        setError(data.error || 'لم نتمكن من العثور على أي طلب مسجل برقم الطلب أو رقم الهاتف هذا.');
      }
    } catch (e) {
      setError('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const handleSelectSavedOrder = (orderNum: string) => {
    setSearchQuery(orderNum);
    fetchOrder(orderNum);
  };

  const statusSteps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    { key: 'pending', label: 'تم استلام الطلب', desc: 'تم تسجيل طلبك وتأكيده بنجاح', icon: Package },
    { key: 'preparing', label: 'قيد التجهيز والتعتيق', desc: 'تجهيز الزجاجات والتغليف الفاخر', icon: Clock },
    { key: 'shipped', label: 'خرج مع المندوب', desc: 'الشحنة في طريقها لعنوانك', icon: Truck },
    { key: 'delivered', label: 'تم التسليم بنجاح', desc: 'تمت المعاينة والاستلام بحمد الله', icon: CheckCircle2 }
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndexMap: Record<OrderStatus, number> = {
      pending: 0,
      preparing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1
    };

    const currentIdx = orderIndexMap[currentStatus] ?? 0;
    const stepIdx = orderIndexMap[stepKey] ?? 0;

    if (currentStatus === 'cancelled') return 'cancelled';
    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  const getStatusArabicLabel = (st: OrderStatus | string) => {
    switch (st) {
      case 'pending': return 'بانتظار التأكيد';
      case 'preparing': return 'قيد التجهيز والتعتيق';
      case 'shipped': return 'خرج مع المندوب';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return st;
    }
  };

  const getStatusColor = (st: OrderStatus | string) => {
    switch (st) {
      case 'pending': return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'preparing': return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium block">
          خدمة تتبع الشحنات
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          تتبع حالة طلبك
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto">
          أدخل رقم هاتفك المسجل به الطلب أو كود الطلب لمتابعة مسار الشحنة خطوة بخطوة.
        </p>
      </div>

      {/* 1. Saved Orders from localStorage (Interactive) */}
      {savedOrders.length > 0 && (
        <div className="bg-[#121212] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>طلباتك السابقة على هذا الجهاز:</span>
            </span>
            <span className="text-[10px] text-zinc-500">محفوظة تلقائياً</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {savedOrders.map(saved => {
              const isSelected = order?.orderNumber === saved.orderNumber;
              return (
                <button
                  key={saved.orderNumber}
                  type="button"
                  onClick={() => handleSelectSavedOrder(saved.orderNumber)}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#181818] border-[#C5A880]/60 shadow-sm'
                      : 'bg-[#151515] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {saved.orderNumber}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full border ${getStatusColor(saved.status)}`}>
                        {getStatusArabicLabel(saved.status)}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {saved.firstItemName} {saved.itemsCount > 1 ? `(+${saved.itemsCount - 1})` : ''}
                    </p>
                    <span className="text-[10px] text-zinc-500 block">
                      {new Date(saved.createdAt).toLocaleDateString('ar-EG')} • {saved.total} ج.م
                    </span>
                  </div>

                  <span className="text-[11px] text-[#C5A880] shrink-0 flex items-center gap-0.5 font-medium">
                    <span>تتبع</span>
                    <ChevronLeft className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Unified Search Bar (Phone Number OR Order Number) */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ادخل رقم الموبايل (مثال: 01003508854) أو رقم الطلب (HEBA-XXXX)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-xl pr-10 pl-4 py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !searchQuery.trim()}
          className="px-5 sm:px-7 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs sm:text-sm transition-all shrink-0 disabled:opacity-50"
        >
          {loading ? 'جاري البحث...' : 'تتبع الطلب'}
        </button>
      </form>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Multiple Orders Found for this Phone View */}
      {multipleOrders.length > 1 && (
        <div className="bg-[#121212] border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
          <span className="text-xs font-semibold text-white block">
            عثرنا على ({multipleOrders.length}) طلبات مسجلة بهذا الرقم، اختر الطلب للمتابعة:
          </span>
          <div className="flex flex-wrap gap-2">
            {multipleOrders.map(mo => (
              <button
                key={mo.orderNumber}
                type="button"
                onClick={() => setOrder(mo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  order?.orderNumber === mo.orderNumber
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#181818] text-zinc-300 hover:text-white border border-white/10'
                }`}
              >
                {mo.orderNumber} ({mo.total} ج.م)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Live Order Tracking Details View */}
      {order && (
        <div className="bg-[#121212] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
          
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#C5A880] font-medium block">رقم الطلب:</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusArabicLabel(order.status)}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">{order.orderNumber}</h3>
              <span className="text-xs text-zinc-400 mt-1 block">
                تاريخ الطلب: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'full' }) : 'اليوم'}
              </span>
            </div>

            <div className="text-left">
              <span className="text-xs text-zinc-400 block">إجمالي الحساب:</span>
              <span className="text-2xl font-bold font-display text-white">{order.total} ج.م</span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {order.paymentMethod === 'instapay' ? 'تم الدفع مقدماً' : 'الدفع عند الاستلام'}
              </span>
            </div>
          </div>

          {/* Stepper Status Bar */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">مراحل الشحنة:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {statusSteps.map((step, idx) => {
                const state = getStepStatus(step.key, order.status);
                const Icon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`p-3.5 rounded-xl border transition-all text-right ${
                      state === 'completed'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : state === 'current'
                        ? 'bg-[#1a1714] border-[#C5A880] text-[#C5A880] shadow-sm'
                        : 'bg-[#151515] border-white/[0.05] text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${state === 'current' ? 'text-[#C5A880] animate-pulse' : ''}`} />
                      <span className="text-[10px] font-mono opacity-50">0{idx + 1}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white">{step.label}</h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Updates Timeline Log */}
          {order.statusUpdates && order.statusUpdates.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-zinc-400 font-medium block">سجل التحديثات:</span>
              <div className="space-y-2">
                {order.statusUpdates.map((su, idx) => (
                  <div key={idx} className="bg-[#161616] p-2.5 rounded-xl text-xs flex items-center justify-between gap-3">
                    <span className="text-zinc-200">{su.note}</span>
                    <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                      {new Date(su.updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer & Address Details */}
          <div className="bg-[#161616] p-4 rounded-xl border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1">العميل المستلم:</span>
              <p className="font-semibold text-white">{order.customer?.fullName}</p>
              <p className="text-zinc-400 mt-0.5 font-mono dir-ltr text-right">{order.customer?.phone}</p>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">عنوان التوصيل:</span>
              <p className="font-semibold text-white">{order.customer?.governorate} - {order.customer?.city || ''}</p>
              <p className="text-zinc-400 mt-0.5">{order.customer?.address}</p>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white">العطور في الشحنة:</h4>
            <div className="divide-y divide-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden bg-[#161616]">
              {order.items?.map((item, i) => (
                <div key={i} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-[#C5A880] text-[11px]">({item.selectedSize})</span>
                    <span className="text-zinc-500">×{item.quantity}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{item.price * item.quantity} ج.م</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Notice */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-zinc-300 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>
              <strong>حق المعاينة مكفول:</strong> يحق لك فتح الشحنة واستنشاق العطر والتأكد من ثباته مع المندوب قبل دفع الحساب.
            </span>
          </div>

          {/* WhatsApp Follow-up Button */}
          <div className="pt-2 flex justify-center">
            <a
              href={`https://wa.me/201003508854?text=${encodeURIComponent(
                `السلام عليكم، بستفسر عن مسار طلبي رقم (${order.orderNumber}) المسجل باسم (${order.customer?.fullName}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-all shadow-md hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع خدمة العملاء عبر واتساب (01003508854)</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
      <Suspense fallback={<div className="text-center text-zinc-400 py-12 text-xs">جاري تحميل الصفحة...</div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
