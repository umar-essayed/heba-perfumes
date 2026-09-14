import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getLiveProducts } from '@/lib/products';
import ShopClient from '@/components/shop/ShopClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'المتجر الكامل | هَيْبَة للعطور',
  description: 'تصفح قائمة الـ 22 عطراً العالمية والنيش من هيبة، بتركيز استثنائي وثبات 48 ساعة مع إمكانية المعاينة قبل الدفع.',
};

export default async function ShopPage() {
  const products = await getLiveProducts();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 bg-[#0A0A0A] flex items-center justify-center text-[#C5A880] text-sm">
          جاري تحميل كتالوج عطور هَيْبَة...
        </div>
      }
    >
      <ShopClient initialProducts={products} />
    </Suspense>
  );
}
