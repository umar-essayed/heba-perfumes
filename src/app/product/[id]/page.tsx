import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import ProductDetailClient from '@/components/product/ProductDetailClient';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Generate static params for all 22 perfumes
export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map(product => ({
    id: product.id,
  }));
}

// Dynamic Metadata: Generates OpenGraph and Twitter cards WITHOUT mentioning the price
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = INITIAL_PRODUCTS.find(p => p.id === params.id);

  if (!product) {
    return {
      title: 'عطر غير متوفر | هَيْبَة للعطور',
      description: 'العطر المطلوب غير موجود في قائمة عطور هيبة.',
    };
  }

  // Pure description without any price tags or numbers
  const cleanDescription = product.description || product.tagline;
  const pageTitle = `${product.name} | عطور هَيْبَة`;

  return {
    title: pageTitle,
    description: cleanDescription,
    keywords: [product.name, 'عطور هيبة', 'عطور رجالية', 'عطور حريمية', 'عطور الإسكندرية', 'ثبات 48 ساعة'],
    openGraph: {
      title: pageTitle,
      description: cleanDescription,
      url: `/product/${product.id}`,
      siteName: 'هَيْبَة للعطور',
      locale: 'ar_EG',
      type: 'article',
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: cleanDescription,
      images: [product.image],
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = INITIAL_PRODUCTS.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = INITIAL_PRODUCTS
    .filter(p => p.id !== product.id && (p.gender === product.gender || product.gender === 'الاتنين'))
    .slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts.length > 0 ? relatedProducts : INITIAL_PRODUCTS.slice(0, 3)}
    />
  );
}
