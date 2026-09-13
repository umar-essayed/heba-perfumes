'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Printer,
  MessageCircle,
  RefreshCw,
  Search,
  Lock,
  LogOut,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  SlidersHorizontal,
  ChevronDown,
  Wallet,
  CreditCard,
  Copy
} from 'lucide-react';
import { Order, PerfumeProduct, OrderStatus, Coupon, PaymentSettings } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, EGYPT_GOVERNORATES, DEFAULT_PAYMENT_SETTINGS } from '@/lib/data/initialProducts';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'payments'>('orders');

  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<PerfumeProduct[]>(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Modals State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PerfumeProduct | null>(null);

  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    description: '',
    gender: 'رجالي' as 'رجالي' | 'حريمي' | 'الاتنين',
    image: '/images/perfume-placeholder.jpeg',
    size50Price: 420,
    size100Price: 690,
    inStock: true
  });

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderValue: 0,
    isActive: true
  });

  // Manual Order Form State
  const [manualOrderForm, setManualOrderForm] = useState({
    fullName: '',
    phone: '',
    governorate: 'الإسكندرية',
    address: 'العامرية ثان',
    notes: '',
    selectedProductId: 'sauvage',
    selectedSize: '50 مل',
    quantity: 1,
    paymentMethod: 'cod' as 'cod' | 'instapay'
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [paymentSaveLoading, setPaymentSaveLoading] = useState(false);
  const [paymentSaveMsg, setPaymentSaveMsg] = useState<{ success: boolean; text: string } | null>(null);

  // 1. Check Auth on mount
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchOrders();
        fetchProducts();
        fetchCoupons();
        fetchPaymentSettings();
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch('/api/settings/payment');
      const data = await res.json();
      if (data.success && data.data) {
        setPaymentSettings(data.data);
      }
    } catch (e) {
      console.error('Error fetching payment settings:', e);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSaveLoading(true);
    setPaymentSaveMsg(null);
    try {
      const res = await fetch('/api/settings/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentSettings)
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSaveMsg({ success: true, text: 'تم حفظ وتحديث أرقام الكاش وإنستاباي بنجاح في Firebase وقاعدة البيانات! ✨' });
        setPaymentSettings(data.data);
      } else {
        setPaymentSaveMsg({ success: false, text: data.error || 'فشل في حفظ البيانات' });
      }
    } catch (err: any) {
      setPaymentSaveMsg({ success: false, text: 'تعذر الاتصال بالخادم.' });
    } finally {
      setPaymentSaveLoading(false);
      setTimeout(() => setPaymentSaveMsg(null), 5000);
    }
  };

  const handleResetPaymentDefaults = () => {
    setPaymentSettings({
      ...DEFAULT_PAYMENT_SETTINGS,
      updatedAt: new Date().toISOString()
    });
  };

  // 2. Auth handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        fetchOrders();
        fetchProducts();
        fetchCoupons();
        fetchPaymentSettings();
      } else {
        setAuthError(data.error || 'كلمة المرور غير صحيحة.');
      }
    } catch (err) {
      setAuthError('تعذر الاتصال بالخادم.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      setOrders([]);
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  // 3. Data Fetchers
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  // -------------------------------------------------------------
  // ORDERS CRUD
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      showToast(`جاري تحديث حالة الطلب (${orderId})...`);
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          note: `تم تغيير حالة الطلب بواسطة الإدارة إلى: ${getStatusArabicLabel(newStatus)}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
        );
        showToast(`تم تحديث حالة الطلب (${orderId}) بنجاح.`);
      } else {
        showToast(data.error || 'فشل تحديث حالة الطلب.');
      }
    } catch (err) {
      showToast('حدث خطأ أثناء التحديث.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف الطلب (${orderId}) نهائياً؟`)) {
      return;
    }

    try {
      showToast('جاري حذف الطلب...');
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId && o.orderNumber !== orderId));
        showToast(`تم حذف الطلب (${orderId}) بنجاح.`);
      } else {
        showToast(data.error || 'فشل حذف الطلب.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء الحذف.');
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProd = products.find(p => p.id === manualOrderForm.selectedProductId) || products[0];
      const selectedPrice =
        manualOrderForm.selectedSize === '100 مل'
          ? selectedProd.sizes?.find(s => s.size.includes('100'))?.price || 690
          : selectedProd.price || 420;

      const subtotal = selectedPrice * manualOrderForm.quantity;
      const shippingCost = subtotal >= 900 ? 0 : 45;
      const total = subtotal + shippingCost;

      const orderPayload = {
        customer: {
          fullName: manualOrderForm.fullName,
          phone: manualOrderForm.phone,
          governorate: manualOrderForm.governorate,
          city: 'العامرية',
          address: manualOrderForm.address,
          notes: manualOrderForm.notes
        },
        items: [
          {
            productId: selectedProd.id,
            name: selectedProd.name,
            selectedSize: manualOrderForm.selectedSize,
            price: selectedPrice,
            quantity: manualOrderForm.quantity,
            total: subtotal
          }
        ],
        subtotal,
        shippingCost,
        total,
        paymentMethod: manualOrderForm.paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (data.success) {
        showToast('تم إنشاء الطلب اليدوي بنجاح!');
        setShowAddOrderModal(false);
        fetchOrders();
      } else {
        showToast(data.error || 'فشل إنشاء الطلب.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء إضافة الطلب.');
    }
  };

  // -------------------------------------------------------------
  // PRODUCTS CRUD
  // -------------------------------------------------------------
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = `heba-${productForm.name.split('|')[0].trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const payload: Partial<PerfumeProduct> = {
        id,
        name: productForm.name,
        tagline: productForm.tagline,
        description: productForm.description,
        story: productForm.tagline,
        price: productForm.size50Price,
        rating: 5.0,
        reviewsCount: 1,
        image: productForm.image,
        sizes: [
          { size: '50 مل', price: productForm.size50Price },
          { size: '100 مل', price: productForm.size100Price }
        ],
        sillage: 5,
        longevity: 5,
        fragranceNotes: {
          top: ['حمضيات منعشة'],
          heart: ['توليفة عطرية خاصة'],
          base: ['أخشاب وعنبر']
        },
        suitableFor: ['يومي', 'سهرات'],
        season: 'كل الفصول',
        gender: productForm.gender,
        inStock: productForm.inStock
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showToast('تمت إضافة العطر بنجاح إلى الكتالوج!');
        setShowAddProductModal(false);
        setProducts(prev => [data.data, ...prev]);
      } else {
        showToast(data.error || 'فشل حفظ العطر.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء إضافة العطر.');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();

      if (data.success) {
        showToast('تم تحديث بيانات العطر بنجاح!');
        setProducts(prev => prev.map(p => (p.id === editingProduct.id ? editingProduct : p)));
        setEditingProduct(null);
      } else {
        showToast(data.error || 'فشل تحديث العطر.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء التعديل.');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف العطر (${productName}) من المتجر؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`تم حذف العطر (${productName}) بنجاح.`);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        showToast(data.error || 'فشل حذف العطر.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء الحذف.');
    }
  };

  const handleToggleProductStock = async (product: PerfumeProduct) => {
    const updated = { ...product, inStock: !product.inStock };
    setProducts(prev => prev.map(p => (p.id === product.id ? updated : p)));

    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: updated.inStock })
      });
      showToast(`تم تعديل حالة المخزون للعطر: ${product.name}`);
    } catch (e) {
      showToast('تم التعديل محلياً.');
    }
  };

  // -------------------------------------------------------------
  // COUPONS CRUD
  // -------------------------------------------------------------
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();

      if (data.success) {
        showToast('تم إنشاء الكوبون بنجاح!');
        setShowAddCouponModal(false);
        setCoupons(prev => [data.data, ...prev.filter(c => c.code !== data.data.code)]);
      } else {
        showToast(data.error || 'فشل إنشاء الكوبون.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء حفظ الكوبون.');
    }
  };

  const handleToggleCouponActive = async (coupon: Coupon) => {
    const updated = { ...coupon, isActive: !coupon.isActive };
    setCoupons(prev => prev.map(c => (c.code === coupon.code ? updated : c)));

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast(`تم تغيير حالة الكوبون (${coupon.code})`);
    } catch (e) {}
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الكوبون (${code})؟`)) return;

    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast(`تم حذف الكوبون (${code}) بنجاح.`);
        setCoupons(prev => prev.filter(c => c.code !== code));
      } else {
        showToast(data.error || 'فشل حذف الكوبون.');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء حذف الكوبون.');
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const preparingOrders = orders.filter(o => o.status === 'preparing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      preparingOrders,
      shippedOrders,
      deliveredOrders
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer?.fullName?.toLowerCase().includes(q) ||
        order.customer?.phone?.includes(q) ||
        order.customer?.governorate?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, searchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let matchesCat = true;
      if (productCategoryFilter === 'men') matchesCat = p.gender === 'رجالي' || p.gender === 'رجال';
      else if (productCategoryFilter === 'women') matchesCat = p.gender === 'حريمي' || p.gender === 'نساء';
      else if (productCategoryFilter === 'mix') matchesCat = p.gender === 'الاتنين' || p.gender === 'للجنسين';

      const q = productSearchQuery.trim().toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  // Helpers
  const getStatusArabicLabel = (st: OrderStatus | string) => {
    switch (st) {
      case 'pending': return 'بانتظار التأكيد';
      case 'preparing': return 'قيد التجهيز والتعتيق';
      case 'shipped': return 'خرج للتوصيل';
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

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-zinc-400 text-xs">
        جاري التحقق من أمان الجلسة...
      </div>
    );
  }

  // LOGIN GATE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#C5A880]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">
              لوحة تحكم هَيْبَة للعطور
            </h1>
            <p className="text-xs text-zinc-400 font-light">
              هذه المنطقة مؤمّنة ومخصصة لإدارة المتجر ومتابعة الطلبات.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                كلمة مرور الإدارة (Admin Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="أدخل كلمة المرور..."
                  required
                  autoFocus
                  className="w-full bg-[#181818] border border-white/10 rounded-xl pr-4 pl-11 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{authLoading ? 'جاري التحقق...' : 'دخول آمن للوحة التحكم'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              ← العودة إلى المتجر الرئيسي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-200 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121212] border border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <Image src="/images/logo.jpg" alt="هيبة" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  لوحة تحكم هَيْبَة
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  متصل
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-light mt-0.5">
                الإسكندرية - العامرية ثان • خدمة العملاء: 01003508854
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-colors border border-white/10"
            >
              عرض المتجر
            </Link>

            <button
              onClick={() => {
                fetchOrders();
                fetchProducts();
                fetchCoupons();
                showToast('تم تحديث البيانات بنجاح!');
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs transition-colors border border-white/10"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-medium transition-colors border border-rose-500/20 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#C5A880]/30 text-[#C5A880] text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121212] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 font-light block">إجمالي الإيرادات</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-display text-white">
                {metrics.totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400">ج.م</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">بدون الملغاة</span>
          </div>

          <div className="bg-[#121212] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 font-light block">إجمالي الطلبات</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-display text-white">
                {metrics.totalOrders}
              </span>
              <span className="text-xs text-zinc-400">طلب</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">كافة المحافظات</span>
          </div>

          <div className="bg-[#121212] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 font-light block">قيد التجهيز والشحن</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-display text-blue-300">
                {metrics.preparingOrders + metrics.shippedOrders}
              </span>
              <span className="text-xs text-zinc-400">شحنة</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">تحت المتابعة</span>
          </div>

          <div className="bg-[#121212] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 font-light block">تم التسليم بنجاح</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-display text-emerald-300">
                {metrics.deliveredOrders}
              </span>
              <span className="text-xs text-zinc-400">طلب مسلّم</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">بالمعاينة والتجربة</span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              }`}
            >
              إدارة الطلبات ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              }`}
            >
              كتالوج العطور ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'coupons'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              }`}
            >
              كوبونات الخصم ({coupons.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                fetchPaymentSettings();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'payments'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>المحافظ وإنستاباي</span>
            </button>
          </div>

          {/* Quick Create Buttons per Tab */}
          <div>
            {activeTab === 'orders' && (
              <button
                onClick={() => setShowAddOrderModal(true)}
                className="py-2 px-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء طلب يدوي</span>
              </button>
            )}

            {activeTab === 'products' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="py-2 px-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة عطر جديد</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="py-2 px-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة كود خصم</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS MANAGEMENT (FULL CRUD & TRACKING) */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status Filter & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'pending', label: 'بانتظار التأكيد' },
                  { id: 'preparing', label: 'قيد التجهيز والتعتيق' },
                  { id: 'shipped', label: 'خرج للتوصيل' },
                  { id: 'delivered', label: 'تم التسليم' },
                  { id: 'cancelled', label: 'ملغي' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                      orderStatusFilter === tab.id
                        ? 'bg-white/20 text-white font-medium'
                        : 'bg-[#121212] text-zinc-400 hover:text-zinc-200 border border-white/[0.05]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative md:w-80">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="بحث برقم الطلب، الاسم، الهاتف، المحافظة..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-[#121212] border border-white/[0.06] rounded-2xl text-zinc-500 text-xs">
                لا توجد طلبات تطابق هذا البحث أو الفلتر.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const whatsappStatusText = encodeURIComponent(
                    `أهلاً بحضرتك يا فندم (${order.customer?.fullName || 'عزيزنا العميل'})، معاك فريق عطور هَيْبَة بخصوص طلبك رقم (${order.orderNumber}). حابين نبلغك إن حالة طلبك حالياً: [${getStatusArabicLabel(order.status)}]. لأي استفسار رقمنا تليفون وواتساب: 01003508854.`
                  );

                  return (
                    <div
                      key={order.id || order.orderNumber}
                      className="bg-[#121212] border border-white/[0.06] rounded-2xl p-5 hover:border-white/15 transition-all space-y-4"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-white">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusArabicLabel(order.status)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG') : 'الآن'}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] text-zinc-500 block">بيانات العميل:</span>
                          <p className="font-semibold text-white">{order.customer?.fullName}</p>
                          <p className="font-mono text-zinc-300 dir-ltr text-right">{order.customer?.phone}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-zinc-500 block">عنوان التوصيل:</span>
                          <p className="text-zinc-300">
                            {order.customer?.governorate} - {order.customer?.city || ''}
                          </p>
                          <p className="text-zinc-400 text-[11px] line-clamp-1">{order.customer?.address}</p>
                        </div>

                        <div className="space-y-1 md:text-left">
                          <span className="text-[11px] text-zinc-500 block">قيمة الطلب:</span>
                          <p className="text-base font-bold font-display text-white">
                            {order.total} ج.م
                          </p>
                          <span className="text-[10px] text-zinc-400 block">
                            {order.paymentMethod === 'instapay' ? 'إنستاباي / محفظة' : 'دفع عند الاستلام'}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-[#181818] p-3 rounded-xl space-y-1.5">
                        <span className="text-[10px] text-zinc-500 block">العطور المطلوبة:</span>
                        <div className="flex flex-wrap gap-2.5">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg text-zinc-300 flex items-center gap-2"
                            >
                              <span className="text-white font-medium">{item.name}</span>
                              <span className="text-[#C5A880] text-[10px]">({item.selectedSize})</span>
                              <span className="text-zinc-500">×{item.quantity}</span>
                              <span className="text-zinc-300 font-mono text-[11px]">{item.price} ج</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                        {/* Status update dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-400">تغيير الحالة:</span>
                          <select
                            value={order.status}
                            onChange={e =>
                              handleUpdateOrderStatus(order.id || order.orderNumber, e.target.value as OrderStatus)
                            }
                            className="bg-[#181818] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                          >
                            <option value="pending">بانتظار التأكيد</option>
                            <option value="preparing">قيد التجهيز والتعتيق</option>
                            <option value="shipped">خرج للتوصيل</option>
                            <option value="delivered">تم التسليم</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/20${order.customer?.phone?.replace(/^0/, '')}?text=${whatsappStatusText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واتساب</span>
                          </a>

                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>الفاتورة</span>
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(order.id || order.orderNumber)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCTS CATALOG (FULL CRUD) */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'men', label: 'رجالي' },
                  { id: 'women', label: 'حريمي' },
                  { id: 'mix', label: 'ميكس' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      productCategoryFilter === cat.id
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#121212] text-zinc-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-72">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="بحث باسم العطر..."
                  value={productSearchQuery}
                  onChange={e => setProductSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className="bg-[#121212] border border-white/[0.06] rounded-2xl p-4 flex gap-4 items-start hover:border-white/15 transition-all relative group"
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#0A0A0A] shrink-0 border border-white/10">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#C5A880] border border-white/5">
                        {p.gender}
                      </span>

                      {/* Stock status toggle */}
                      <button
                        onClick={() => handleToggleProductStock(p)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                          p.inStock
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        {p.inStock ? 'متوفر' : 'نفد المخزون'}
                      </button>
                    </div>

                    <h3 className="font-bold text-white truncate">{p.name}</h3>

                    <div className="text-zinc-400 text-[11px] pt-1">
                      {p.sizes?.map((s, i) => (
                        <span key={i} className="ml-2">
                          {s.size}: <strong className="text-white font-mono">{s.price} ج</strong>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="text-[#C5A880] hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: COUPONS (FULL CRUD) */}
        {/* ======================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c, idx) => (
                <div
                  key={c.code || idx}
                  className="bg-[#121212] border border-white/[0.06] rounded-2xl p-5 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                      {c.code}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      خصم {c.discountValue}{c.discountType === 'percentage' ? '%' : ' ج.م'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggleCouponActive(c)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                        c.isActive
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {c.isActive ? 'كوبون مفعّل' : 'غير مفعّل'}
                    </button>

                    <span className="text-[10px] text-zinc-500">
                      الحد الأدنى: {c.minOrderValue || 0} ج
                    </span>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف الكوبون</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: WALLETS & INSTAPAY SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Intro Card */}
            <div className="bg-[#121212] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#C5A880]" />
                  <span>إدارة أرقام المحافظ الإلكترونية و إنستاباي (InstaPay)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  تحكم في أرقام الهواتف ومعرّفات التحويل التي تظهر للعملاء في صفحة إتمام الطلب (Checkout). يتم الحفظ والتحديث فوراً في Firebase Firestore.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetPaymentDefaults}
                  className="px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  استعادة الافتراضي (01003508854)
                </button>
              </div>
            </div>

            {/* Notification message */}
            {paymentSaveMsg && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                  paymentSaveMsg.success
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                }`}
              >
                {paymentSaveMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{paymentSaveMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Column */}
              <div className="lg:col-span-7 bg-[#121212] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                <h4 className="text-xs font-bold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C5A880]" />
                  <span>تعديل بيانات وأرقام التحويل</span>
                </h4>

                <form onSubmit={handleSavePaymentSettings} className="space-y-4 text-xs">
                  {/* Cash Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-zinc-300 font-medium">
                      رقم محفظة الكاش الأساسية (فودافون كاش / اتصالات / أورانج / وي): <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={paymentSettings.cashPhone}
                      onChange={e => setPaymentSettings({ ...paymentSettings, cashPhone: e.target.value })}
                      placeholder="01003508854"
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                    <span className="text-[11px] text-zinc-500 block">الافتراضي: 01003508854 (نفس رقم المتجر والواتساب الرسمي).</span>
                  </div>

                  {/* Secondary Cash Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-zinc-300 font-medium">
                      رقم محفظة كاش إضافي (اختياري في حال امتلاك أكثر من خط):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={paymentSettings.secondaryCashPhone || ''}
                      onChange={e => setPaymentSettings({ ...paymentSettings, secondaryCashPhone: e.target.value })}
                      placeholder="مثال: 01234567890"
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* InstaPay Phone */}
                    <div className="space-y-1.5">
                      <label className="block text-zinc-300 font-medium">
                        رقم هاتف إنستاباي (InstaPay): <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={paymentSettings.instapayPhone}
                        onChange={e => setPaymentSettings({ ...paymentSettings, instapayPhone: e.target.value })}
                        placeholder="01003508854"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#C5A880]"
                      />
                      <span className="text-[10px] text-zinc-500 block">الافتراضي: 01003508854</span>
                    </div>

                    {/* InstaPay IPA Handle */}
                    <div className="space-y-1.5">
                      <label className="block text-zinc-300 font-medium">
                        معرّف الدفع اللحظي (IPA Handle):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={paymentSettings.instapayUsername || ''}
                        onChange={e => setPaymentSettings({ ...paymentSettings, instapayUsername: e.target.value })}
                        placeholder="01003508854@instapay"
                        className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#C5A880]"
                      />
                      <span className="text-[10px] text-zinc-500 block">مثال: 01003508854@instapay</span>
                    </div>
                  </div>

                  {/* Account Holder Name */}
                  <div className="space-y-1.5">
                    <label className="block text-zinc-300 font-medium">
                      اسم صاحب الحساب أو المحفظة:
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.accountHolderName}
                      onChange={e => setPaymentSettings({ ...paymentSettings, accountHolderName: e.target.value })}
                      placeholder="هَيْبَة للعطور"
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Transfer Instructions */}
                  <div className="space-y-1.5">
                    <label className="block text-zinc-300 font-medium">
                      تعليمات وتنبيه التحويل للعميل:
                    </label>
                    <textarea
                      rows={3}
                      value={paymentSettings.transferInstructions || ''}
                      onChange={e => setPaymentSettings({ ...paymentSettings, transferInstructions: e.target.value })}
                      placeholder="يرجى إرسال لقطة شاشة (سكرين شوت) للتحويل على الواتساب 01003508854 لتأكيد الأوردر فوراً."
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A880] resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={paymentSaveLoading}
                      className="w-full py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                    >
                      {paymentSaveLoading ? (
                        <span>جاري الحفظ في Firestore...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>حفظ وتطبيق بيانات الدفع على المتجر فوراً</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#121212] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#C5A880]" />
                      <span>معاينة حية لشاشة العميل (Checkout Preview)</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                      مباشر الآن
                    </span>
                  </div>

                  {/* Customer view simulation */}
                  <div className="p-4 bg-[#141416] border border-white/10 rounded-xl space-y-3.5 text-right">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <span className="text-xs font-bold text-white">بيانات التحويل المعتمدة لمتجر هَيْبَة</span>
                      {paymentSettings.accountHolderName && (
                        <span className="text-[10px] text-[#C5A880] font-medium bg-[#C5A880]/10 px-2 py-0.5 rounded border border-[#C5A880]/20">
                          باسم: {paymentSettings.accountHolderName}
                        </span>
                      )}
                    </div>

                    {/* Cash Wallet Box */}
                    <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                          فودافون كاش والمحافظ
                        </span>
                        <span className="text-[10px] text-[#C5A880] bg-white/5 px-2 py-0.5 rounded">
                          زر نسخ للعميل
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xs text-zinc-400">رقم المحفظة:</span>
                        <span className="text-sm font-bold font-mono tracking-wider text-white" dir="ltr">
                          {paymentSettings.cashPhone || '01003508854'}
                        </span>
                      </div>
                      {paymentSettings.secondaryCashPhone && (
                        <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.04]">
                          <span className="text-xs text-zinc-400">محفظة إضافية:</span>
                          <span className="text-xs font-mono text-zinc-300" dir="ltr">
                            {paymentSettings.secondaryCashPhone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* InstaPay Box */}
                    <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
                          إنستاباي (InstaPay)
                        </span>
                        <span className="text-[10px] text-[#C5A880] bg-white/5 px-2 py-0.5 rounded">
                          زر نسخ للعميل
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xs text-zinc-400">رقم الهاتف:</span>
                        <span className="text-sm font-bold font-mono tracking-wider text-white" dir="ltr">
                          {paymentSettings.instapayPhone || '01003508854'}
                        </span>
                      </div>
                      {paymentSettings.instapayUsername && (
                        <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.04]">
                          <span className="text-xs text-zinc-400">معرّف IPA:</span>
                          <span className="text-xs font-mono text-[#C5A880]" dir="ltr">
                            {paymentSettings.instapayUsername}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Instructions Box */}
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                      <MessageCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-amber-200">
                        {paymentSettings.transferInstructions || 'يرجى إرسال لقطة شاشة للتحويل عبر الواتساب لتأكيد الأوردر فوراً.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ADD PRODUCT */}
        {/* ======================================================== */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 text-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold font-display">إضافة عطر جديد للكتالوج</h3>
                <button onClick={() => setShowAddProductModal(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">اسم العطر:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سوفاج إليكسير | Sauvage Elixir"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">شعار مختصر (Tagline):</label>
                  <input
                    type="text"
                    placeholder="مثال: عطر بطابع خشبي دافئ وحضور طاغي"
                    value={productForm.tagline}
                    onChange={e => setProductForm({ ...productForm, tagline: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">الوصف العطري:</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="وصف تفصيلي للنوتات العطرية والمناسبات..."
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">التصنيف:</label>
                    <select
                      value={productForm.gender}
                      onChange={e => setProductForm({ ...productForm, gender: e.target.value as any })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="رجالي">رجالي</option>
                      <option value="حريمي">حريمي</option>
                      <option value="الاتنين">ميكس (الاتنين)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">صورة العطر:</label>
                    <select
                      value={productForm.image}
                      onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="/images/perfume-placeholder.jpeg">صورة العطور الرجالية</option>
                      <option value="/images/perfume-placeholde-women.jpeg">صورة العطور الحريمية</option>
                      <option value="/images/perfume-womenandmen.jpeg">صورة عطور الميكس</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">سعر 50 مل (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={productForm.size50Price}
                      onChange={e => setProductForm({ ...productForm, size50Price: Number(e.target.value) })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">سعر 100 مل (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={productForm.size100Price}
                      onChange={e => setProductForm({ ...productForm, size100Price: Number(e.target.value) })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs transition-all"
                  >
                    حفظ وإضافة العطر
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: EDIT PRODUCT */}
        {/* ======================================================== */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 text-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold font-display">تعديل بيانات العطر</h3>
                <button onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">اسم العطر:</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">الوصف:</label>
                  <textarea
                    rows={2}
                    required
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">السعر الأساسي (50 مل):</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={e => {
                        const newPrice = Number(e.target.value);
                        const newSizes = [...(editingProduct.sizes || [])];
                        if (newSizes[0]) newSizes[0].price = newPrice;
                        setEditingProduct({ ...editingProduct, price: newPrice, sizes: newSizes });
                      }}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">التصنيف:</label>
                    <select
                      value={editingProduct.gender}
                      onChange={e => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="رجالي">رجالي</option>
                      <option value="حريمي">حريمي</option>
                      <option value="الاتنين">ميكس (الاتنين)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs transition-all"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ADD MANUAL ORDER */}
        {/* ======================================================== */}
        {showAddOrderModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 text-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold font-display">إنشاء طلب يدوي جديد</h3>
                <button onClick={() => setShowAddOrderModal(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">اسم العميل:</label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم ثلاثي..."
                    value={manualOrderForm.fullName}
                    onChange={e => setManualOrderForm({ ...manualOrderForm, fullName: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">رقم الهاتف:</label>
                    <input
                      type="tel"
                      required
                      placeholder="01003508854"
                      value={manualOrderForm.phone}
                      onChange={e => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">المحافظة:</label>
                    <select
                      value={manualOrderForm.governorate}
                      onChange={e => setManualOrderForm({ ...manualOrderForm, governorate: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      {EGYPT_GOVERNORATES.map(g => (
                        <option key={g.governorate} value={g.governorate}>
                          {g.governorate} ({g.cost} ج)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">العنوان التفصيلي:</label>
                  <input
                    type="text"
                    required
                    placeholder="العامرية ثان، الشارع، المعلم..."
                    value={manualOrderForm.address}
                    onChange={e => setManualOrderForm({ ...manualOrderForm, address: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-zinc-400 mb-1">اختر العطر:</label>
                    <select
                      value={manualOrderForm.selectedProductId}
                      onChange={e => setManualOrderForm({ ...manualOrderForm, selectedProductId: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">الحجم:</label>
                    <select
                      value={manualOrderForm.selectedSize}
                      onChange={e => setManualOrderForm({ ...manualOrderForm, selectedSize: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="50 مل">50 مل</option>
                      <option value="100 مل">100 مل</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs transition-all"
                  >
                    حفظ وتسجيل الطلب
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddOrderModal(false)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ADD COUPON */}
        {/* ======================================================== */}
        {showAddCouponModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 text-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold font-display">إضافة كود خصم جديد</h3>
                <button onClick={() => setShowAddCouponModal(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">كود الكوبون:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: HEBA20"
                    value={couponForm.code}
                    onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">نوع الخصم:</label>
                    <select
                      value={couponForm.discountType}
                      onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">قيمة الخصم:</label>
                    <input
                      type="number"
                      required
                      value={couponForm.discountValue}
                      onChange={e => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">الحد الأدنى لقيمة الطلب (ج.م):</label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue}
                    onChange={e => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#C5A880] hover:bg-[#D8BD97] text-black font-semibold text-xs transition-all"
                  >
                    حفظ وتفعيل الكوبون
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCouponModal(false)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PRINTABLE INVOICE MODAL */}
        {/* ======================================================== */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-black w-full max-w-2xl rounded-2xl p-8 space-y-6 shadow-2xl relative my-8 print:m-0 print:p-4">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between border-b-2 border-black pb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-wide">هَيْبَة للعطور</h2>
                  <p className="text-xs text-zinc-600 font-medium">عطور تفرض حضورك</p>
                  <p className="text-xs text-zinc-600">الإسكندرية - العامرية ثان</p>
                  <p className="text-xs text-zinc-600 font-mono dir-ltr text-right">01003508854</p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-xs uppercase font-bold text-zinc-500 block">فاتورة شحن وتوصيل</span>
                  <span className="font-mono text-lg font-black block">
                    {selectedOrderForInvoice.orderNumber}
                  </span>
                  <span className="text-xs text-zinc-600 block">
                    {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 font-bold block mb-1">العميل المستلم:</span>
                  <p className="font-bold text-sm">{selectedOrderForInvoice.customer?.fullName}</p>
                  <p className="font-mono dir-ltr text-right">{selectedOrderForInvoice.customer?.phone}</p>
                </div>
                <div>
                  <span className="text-zinc-500 font-bold block mb-1">عنوان التوصيل:</span>
                  <p className="font-semibold">{selectedOrderForInvoice.customer?.governorate}</p>
                  <p className="text-zinc-700">{selectedOrderForInvoice.customer?.address}</p>
                </div>
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-zinc-300 text-zinc-600">
                    <th className="text-right py-2">العطر</th>
                    <th className="text-center py-2">الحجم</th>
                    <th className="text-center py-2">الكمية</th>
                    <th className="text-left py-2">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {selectedOrderForInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold">{item.name}</td>
                      <td className="text-center py-2.5">{item.selectedSize}</td>
                      <td className="text-center py-2.5 font-mono">×{item.quantity}</td>
                      <td className="text-left py-2.5 font-mono font-bold">{item.price * item.quantity} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-black pt-3 flex justify-between items-center text-sm">
                <div>
                  <span className="text-xs text-zinc-600 block">طريقة الدفع:</span>
                  <span className="font-bold">
                    {selectedOrderForInvoice.paymentMethod === 'instapay'
                      ? 'إنستاباي / محفظة إلكترونية'
                      : 'دفع عند الاستلام (COD)'}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-zinc-600 block">المبلغ المطلوب تحصيله:</span>
                  <span className="text-2xl font-black font-mono">
                    {selectedOrderForInvoice.total} ج.م
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-100 rounded-lg text-center text-[11px] text-zinc-700 border border-zinc-300">
                <strong>تنبيه لمندوب الشحن والعميل:</strong> يحق للعميل فتح الشحنة واستنشاق العطر والتأكد من ثباته وجودته قبل دفع المبلغ.
              </div>

              <div className="flex gap-3 pt-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الفاتورة الآن</span>
                </button>

                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 text-black font-medium text-xs rounded-xl"
                >
                  إغلاق
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
