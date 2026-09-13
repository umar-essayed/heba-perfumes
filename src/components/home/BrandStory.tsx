import React from 'react';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="py-20 sm:py-28 text-center bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium block">
          عن هَيْبَة للعطور
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
          الهيبة ليست مجرد اسم، بل حضور يبقى.
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          انطلقنا برؤية واضحة: تقديم أرقى التوليفات العطرية العالمية والنيش بزيوت مركزة ونقية تمنحك ثباتاً حقيقياً يتجاوز 48 ساعة. نحرص على تقديم تجربة تسوق راقية تمكّنك من معاينة العطر وتجربته قبل الدفع.
        </p>

        <div className="pt-4">
          <Link
            href="/shop"
            className="text-xs text-[#C5A880] hover:underline font-medium tracking-wide"
          >
            تصفح القائمة الكاملة لجميع العطور ←
          </Link>
        </div>
      </div>
    </section>
  );
}
