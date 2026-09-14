import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLiveProduct, getLiveProducts } from '@/lib/products';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Dynamic Metadata: Generates OpenGraph and Twitter cards WITHOUT mentioning the price
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getLiveProduct(params.id);

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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getLiveProduct(params.id);

  if (!product) {
    notFound();
  }

  const allProducts = await getLiveProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.gender === product.gender || product.gender === 'الاتنين'))
    .slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts.length > 0 ? relatedProducts : allProducts.slice(0, 3)}
    />
  );
}
