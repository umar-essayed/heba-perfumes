import React from 'react';
import { Eye, Clock, Truck } from 'lucide-react';

export default function FeaturesBanner() {
  const features = [
    {
      icon: Eye,
      title: 'معاينة واستنشاق قبل الدفع',
      desc: 'المندوب ينتظرك لتجربة العطر والتأكد من ثباته وجودته بنفسك قبل الاستلام.'
    },
    {
      icon: Clock,
      title: 'ثبات يدوم لأكثر من 48 ساعة',
      desc: 'زيوت عطرية نقية معتّقة بعناية لضمان فوحان يدوم طويلاً على الملابس.'
    },
    {
      icon: Truck,
      title: 'توصيل لجميع محافظات مصر',
      desc: 'شحن سريع في غضون 24 إلى 48 ساعة بتغليف محكم ومحمي ضد الصدمات.'
    }
  ];

  return (
    <section className="py-10 border-b border-white/[0.06] bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
