import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Truck, RefreshCw, MapPin, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.07] text-zinc-400 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-white/[0.07]">
          <div className="flex items-center gap-3.5 bg-[#121212] p-4 rounded-xl border border-white/[0.05]">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-white font-medium text-xs sm:text-sm">معاينة قبل الدفع</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">افتح الشحنة واستنشق العطر مع المندوب</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#121212] p-4 rounded-xl border border-white/[0.05]">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-white font-medium text-xs sm:text-sm">ثبات يتجاوز 48 ساعة</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">زيوت فرنسية مركزة ونقية تدوم طويلاً</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#121212] p-4 rounded-xl border border-white/[0.05]">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-white font-medium text-xs sm:text-sm">شحن لجميع المحافظات</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">توصيل سريع ومحمي لباب منزلك</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#121212] p-4 rounded-xl border border-white/[0.05]">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-white font-medium text-xs sm:text-sm">ضمان الاستبدال</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">حق التجربة مع المندوب لراحة بالك</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                <Image
                  src="/images/logo.jpg"
                  alt="هيبة للعطور"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-white block">
                  هَيْبَة
                </span>
                <span className="text-[10px] text-[#C5A880] tracking-wider uppercase font-light">
                  عطور تفرض حضورك
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              هَيْبَة للعطور – توليفات عطرية فرنسية وشرقية بزيوت نقية ومختارة بعناية لمن يبحث عن الفخامة والثبات الحقيقي.
            </p>
            
            {/* Address */}
            <div className="pt-2 flex items-start gap-2.5 text-xs text-zinc-300">
              <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <span>الإسكندرية - العامرية ثان</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              تصنيفات العطور
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/shop?category=men" className="hover:text-white transition-colors">
                  عطور رجالية (7 عطور)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=women" className="hover:text-white transition-colors">
                  عطور حريمية (9 عطور)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mix" className="hover:text-white transition-colors">
                  عطور ميكس للجنسين (6 عطور)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  القائمة الكاملة (22 عطراً)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              عطور مميزة
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/product/sauvage" className="hover:text-[#C5A880] transition-colors">
                  سوفاج | Sauvage
                </Link>
              </li>
              <li>
                <Link href="/product/khamrah" className="hover:text-[#C5A880] transition-colors">
                  خمرة | Khamrah
                </Link>
              </li>
              <li>
                <Link href="/product/bianco-latte" className="hover:text-[#C5A880] transition-colors">
                  بيانكو لاتيه | Bianco Latte
                </Link>
              </li>
              <li>
                <Link href="/product/megamare" className="hover:text-[#C5A880] transition-colors">
                  ميجامار | Megamare
                </Link>
              </li>
              <li>
                <Link href="/product/baccarat-rouge" className="hover:text-[#C5A880] transition-colors">
                  بكرات روج | Baccarat Rouge
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              التواصل وخدمة العملاء
            </h4>
            <div className="space-y-3 text-xs text-zinc-300">
              {/* Phone Calling */}
              <a
                href="tel:01003508854"
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#121212] border border-white/[0.06] hover:border-[#C5A880]/40 transition-colors group"
              >
                <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[#C5A880]">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">اتصال هاتفي</span>
                  <span className="font-semibold text-white group-hover:text-[#C5A880] font-mono dir-ltr">
                    01003508854
                  </span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201003508854"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#121212] border border-white/[0.06] hover:border-emerald-500/40 transition-colors group"
              >
                <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">محادثة واتساب</span>
                  <span className="font-semibold text-white group-hover:text-emerald-400 font-mono dir-ltr">
                    01003508854
                  </span>
                </div>
              </a>

              <div className="pt-1">
                <Link href="/track-order" className="text-zinc-400 hover:text-white transition-colors block py-1">
                  تتبع طلبك برقم الهاتف ←
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} هَيْبَة للعطور. الإسكندرية - العامرية ثان. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">تطوير:</span>
            <a
              href="https://wa.me/201553442304"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#C5A880] hover:text-white font-medium bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
              title="تواصل مع المطور عبر واتساب"
            >
              <span className="font-bold">3amor</span>
              <span className="text-zinc-500">|</span>
              <span className="font-mono text-[10px] text-emerald-400" dir="ltr">01553442304</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
