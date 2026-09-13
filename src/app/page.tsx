import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesBanner from '@/components/home/FeaturesBanner';
import BestSellersSection from '@/components/home/BestSellersSection';
import GiftBoxesSection from '@/components/home/GiftBoxesSection';
import BrandStory from '@/components/home/BrandStory';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const snapshot = await adminDb.collection('products').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as typeof INITIAL_PRODUCTS;
    }
  } catch (error) {
    // Graceful fallback
  }
  return INITIAL_PRODUCTS;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      <HeroSection />
      <FeaturesBanner />
      <BestSellersSection products={products} />
      <GiftBoxesSection />
      <BrandStory />
    </div>
  );
}
