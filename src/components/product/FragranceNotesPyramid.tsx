import React from 'react';
import { Sparkles, Heart, Crown } from 'lucide-react';

interface FragranceNotesPyramidProps {
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
}

export default function FragranceNotesPyramid({ notes }: FragranceNotesPyramidProps) {
  return (
    <div className="space-y-4 bg-obsidian-900/60 p-5 rounded-2xl border border-gold-500/20">
      <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
        <Crown className="w-4 h-4 text-gold-400" />
        <span>الهرم العطري وسر التركيبة (النوتات)</span>
      </h4>

      <div className="space-y-3">
        {/* Top Notes */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-950/60 border border-gold-500/10">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-300">قمة العطر (Top Notes)</span>
              <span className="text-[10px] text-zinc-500">أول رشة وأول انطباع</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {notes.top.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-obsidian-800 text-zinc-200 border border-gold-500/15"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Heart Notes */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-950/60 border border-gold-500/10">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-300">قلب العطر (Heart Notes)</span>
              <span className="text-[10px] text-zinc-500">روح وجوهر العطر</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {notes.heart.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-obsidian-800 text-zinc-200 border border-gold-500/15"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Base Notes */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-950/60 border border-gold-500/10">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
            <Crown className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-300">قاعدة العطر (Base Notes)</span>
              <span className="text-[10px] text-zinc-500">سر الثبات والفوحان لـ 48 ساعة</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {notes.base.map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-obsidian-800 text-zinc-200 border border-gold-500/15"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
