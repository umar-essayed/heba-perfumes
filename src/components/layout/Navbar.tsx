'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemsCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'رجالي', href: '/shop?category=men' },
    { name: 'حريمي', href: '/shop?category=women' },
    { name: 'ميكس', href: '/shop?category=mix' },
    { name: 'جميع العطور', href: '/shop' },
    { name: 'تتبع الطلب', href: '/track-order' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/10">
              <Image
                src="/images/logo.jpg"
                alt="هيبة للعطور"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-display tracking-wide text-white">
                هَيْبَة
              </span>
              <span className="text-[10px] text-zinc-400 tracking-wider font-light -mt-1">
                PERFUMES
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right/Left Action: Phone, Cart & Mobile menu */}
          <div className="flex items-center gap-3">
            <a
              href="tel:01003508854"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white py-1.5 px-3 rounded-full bg-white/5 border border-white/10 hover:border-[#C5A880]/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-mono dir-ltr text-[11px]">01003508854</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {itemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#C5A880] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-white/10 px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
