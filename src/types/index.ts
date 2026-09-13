export interface PerfumeProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  image: string;
  secondaryImages?: string[];
  sizes: {
    size: string; // e.g., '50 مل', '100 مل'
    price: number;
    originalPrice?: number;
  }[];
  sillage: number; // 1-5 فوحان العطر
  longevity: number; // 1-5 ثبات العطر
  fragranceNotes: {
    top: string[]; // القمة العطرية
    heart: string[]; // قلب العطر
    base: string[]; // قاعدة العطر
  };
  suitableFor: string[]; // سهرات، يومي، رسمي، كاجوال
  season: string; // صيفي، شتوي، كل الفصول
  gender: 'رجالي' | 'حريمي' | 'الاتنين' | 'رجال' | 'نساء' | 'للجنسين';
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  selectedSize: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  selectedSize: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    secondaryPhone?: string;
    governorate: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'instapay' | 'vodafone_cash' | 'card';
  isGift?: boolean;
  giftMessage?: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdates?: {
    status: OrderStatus;
    updatedAt: string;
    note?: string;
  }[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  isActive: boolean;
}

export interface ShippingZone {
  governorate: string;
  cost: number;
  estimatedDelivery: string;
}
