'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, PerfumeProduct, Coupon, ShippingZone } from '@/types';
import { EGYPT_GOVERNORATES } from '@/lib/data/initialProducts';

interface CartContextType {
  items: CartItem[];
  isLoaded: boolean;
  addToCart: (product: PerfumeProduct, size: string, price: number, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemsCount: number;
  subtotal: number;
  shippingZone: ShippingZone;
  setShippingGovernorate: (govName: string) => void;
  shippingCost: number;
  appliedCoupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  total: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 900; // شحن مجاني لأي طلب بقيمة 900 ج أو أكثر
const STORAGE_KEY = 'heba_cart_items_v2';
const COUPON_KEY = 'heba_applied_coupon';
const ZONE_KEY = 'heba_shipping_zone';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingZone, setShippingZone] = useState<ShippingZone>(EGYPT_GOVERNORATES[0]);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  // 1. Initial Load from localStorage (strictly runs once on mount)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedItems = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('heba_cart_items');
        if (savedItems) {
          const parsed = JSON.parse(savedItems);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }

        const savedCoupon = localStorage.getItem(COUPON_KEY);
        if (savedCoupon) {
          setAppliedCoupon(JSON.parse(savedCoupon));
        }

        const savedZone = localStorage.getItem(ZONE_KEY);
        if (savedZone) {
          const parsedZone = JSON.parse(savedZone);
          if (parsedZone?.governorate) {
            setShippingZone(parsedZone);
          }
        }
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Persist to localStorage ONLY after initial load is complete
  useEffect(() => {
    if (!isLoaded) return; // CRITICAL: NEVER overwrite storage before initial load finishes!

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        // Keep fallback key updated too
        localStorage.setItem('heba_cart_items', JSON.stringify(items));

        if (appliedCoupon) {
          localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
        } else {
          localStorage.removeItem(COUPON_KEY);
        }

        localStorage.setItem(ZONE_KEY, JSON.stringify(shippingZone));
      }
    } catch (e) {
      console.error('Error persisting cart:', e);
    }
  }, [items, appliedCoupon, shippingZone, isLoaded]);

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : shippingZone.cost;

  // Recalculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const addToCart = useCallback((product: PerfumeProduct, size: string, price: number, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.productId === product.id && i.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.image,
          selectedSize: size,
          price,
          quantity
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('heba_cart_items');
        localStorage.removeItem(COUPON_KEY);
      }
    } catch (e) {}
  }, []);

  const setShippingGovernorate = useCallback((govName: string) => {
    const found = EGYPT_GOVERNORATES.find(g => g.governorate === govName);
    if (found) {
      setShippingZone(found);
    }
  }, []);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });

      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discountAmount || 0
        });
        return { success: true, message: data.message || 'تم تطبيق الخصم بنجاح!' };
      } else {
        return { success: false, message: data.error || 'كود الخصم غير صالح.' };
      }
    } catch (err) {
      return { success: false, message: 'تعذر التحقق من كود الخصم.' };
    }
  };

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemsCount,
        subtotal,
        shippingZone,
        setShippingGovernorate,
        shippingCost,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        isFreeShipping,
        amountNeededForFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
