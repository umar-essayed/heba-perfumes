'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = '01003508854';
  const whatsappUrl = `https://wa.me/201003508854?text=${encodeURIComponent(
    'السلام عليكم، كنت حابب أستفسر بخصوص عطور هَيْبَة'
  )}`;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
      {/* Direct Phone Call */}
      <a
        href={`tel:${phone}`}
        aria-label={`اتصال هاتفي: ${phone}`}
        className="w-11 h-11 rounded-full bg-[#161616] hover:bg-[#222222] text-[#C5A880] border border-white/10 flex items-center justify-center shadow-lg transition-all hover:scale-105"
        title="اتصال هاتفي"
      >
        <Phone className="w-4 h-4" />
      </a>

      {/* WhatsApp Chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل واتساب"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-emerald-600/30 transition-all hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-medium hidden sm:inline">
          واتساب ({phone})
        </span>
      </a>
    </div>
  );
}
