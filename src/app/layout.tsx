import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import ClientLayoutShell from '@/components/layout/ClientLayoutShell';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'هَيْبَة للعطور | عطور تفرض حضورك',
    template: '%s | هَيْبَة للعطور',
  },
  description: 'عطور هَيْبَة – تشكيلة حصرية من 22 عطراً من أرقى الإبداعات العالمية والنيش، بتركيز زيوت عالية وثبات استثنائي يتجاوز 48 ساعة. معاينة وتجربة قبل الدفع. الإسكندرية - العامرية ثان.',
  keywords: ['عطور هيبة', 'عطور رجالية', 'عطور حريمية', 'عطور ميكس', 'سوفاج', 'خمرة', 'بيانكو لاتيه', 'ميجامار', 'عطور الإسكندرية'],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: '/',
    siteName: 'هَيْبَة للعطور',
    title: 'هَيْبَة للعطور | عطور تفرض حضورك',
    description: 'تشكيلة حصرية من أرقى الإبداعات العالمية والنيش بتركيز زيوت عالية وثبات استثنائي يتجاوز 48 ساعة مع إمكانية المعاينة قبل الدفع.',
    images: [
      {
        url: '/images/perfume-placeholder.jpeg',
        width: 1200,
        height: 630,
        alt: 'هَيْبَة للعطور',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'هَيْبَة للعطور | عطور تفرض حضورك',
    description: 'تشكيلة حصرية من أرقى الإبداعات العالمية والنيش بتركيز زيوت عالية وثبات يتجاوز 48 ساعة.',
    images: ['/images/perfume-placeholder.jpeg'],
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=El+Messiri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-obsidian-950 text-zinc-100 antialiased min-h-screen flex flex-col selection:bg-gold-500 selection:text-black">
        <CartProvider>
          <ClientLayoutShell>
            {children}
          </ClientLayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
