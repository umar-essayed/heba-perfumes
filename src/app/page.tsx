import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesBanner from '@/components/home/FeaturesBanner';
import BestSellersSection from '@/components/home/BestSellersSection';
import GiftBoxesSection from '@/components/home/GiftBoxesSection';
import BrandStory from '@/components/home/BrandStory';
import { getLiveProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const products = await getLiveProducts();

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
