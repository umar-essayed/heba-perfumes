import React from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    {
      name: 'كريم الشاذلي',
      city: 'القاهرة (التجمع الخامس)',
      perfume: 'ميجامار | Megamare',
      rating: 5,
      comment: 'بأمانة يا جماعة ميجامار من عندكم حكاية تانية خالص! الثبات خرافي بجد.. رشيت رشتين الصبح والريحة فضلت ثابتة في القميص لتاني يوم والكل في الشغل سألني عليها. خدمة التوصيل سريعة جداً والمندوب استناني أجرب الأول واطمن.',
      date: 'منذ يومين'
    },
    {
      name: 'محمود الصاوي',
      city: 'الجيزة (الدقي)',
      perfume: 'سوفاج | Sauvage',
      rating: 5,
      comment: 'سوفاج بإصدار الحبل الطبيعي شكله تحفة فنية على التسريحة! فريش وقوي جداً للخروج اليومي والمناسبات، ريحته بتفكرك بالعطور الأوريجينال الغالية بكسر السعر. التغليف الكرافت شيك جداً وذوق عالي.',
      date: 'منذ 4 أيام'
    },
    {
      name: 'سارة عبد الرحمن',
      city: 'الإسكندرية (سموحة)',
      perfume: 'بيانكو لاتيه | Bianco Latte',
      rating: 5,
      comment: 'أحلى وألذ عطر فانيليا وكراميل جربته في حياتي! ريحته دافية وبتاخد العقل، والكل كان مبهور بيها في السهرة. كتبولي كارت إهداء روعة بالحرف، شكراً ليكم بجد وإن شاء الله هطلب باقي الكوليكشن قريباً.',
      date: 'منذ أسبوع'
    }
  ];

  return (
    <section className="py-20 bg-obsidian-900/50 border-t border-gold-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>تجارب حقيقية من عملائنا في مصر</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            ناس جربت الهيبة.. <span className="gold-gradient-text">وقالوا كلمتهم بصراحة</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            ثقة عملائنا هي سر نجاحنا، وكل تقييم هنا من عميل استلم وجرب واستنشق بنفسه.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-obsidian-950/80 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 relative"
            >
              <Quote className="w-8 h-8 text-gold-500/20 absolute top-5 left-5" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gold-500/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white font-display">{rev.name}</h4>
                    <span title="مشتري موثق">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 block">{rev.city}</span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-gold-400 bg-gold-950 px-2 py-0.5 rounded border border-gold-500/20 block">
                    {rev.perfume}
                  </span>
                  <span className="text-[10px] text-zinc-600 block mt-0.5">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
