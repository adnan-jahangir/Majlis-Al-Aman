import React from 'react';
import { Check, Sun, Sunrise, Sunset, Moon, Sparkles, Clock } from 'lucide-react';
import { PrayerName, PrayerStatus } from '../types';

interface PrayerCardProps {
  name: PrayerName;
  arabicName: string;
  time: string;
  status: PrayerStatus;
  isNext?: boolean;
  onOpenConfirm: (name: PrayerName) => void;
  onQuickToggle: (name: PrayerName, e: React.MouseEvent) => void;
}

const PRAYER_THEMES: Record<PrayerName, {
  period: string;
  rakats: string;
  icon: React.ReactNode;
  activeBorder: string;
  glowColor: string;
  badgeBg: string;
}> = {
  Fajr: {
    period: 'Dawn • الغلس',
    rakats: '2 Sunnah + 2 Fard',
    icon: <Sunrise className="w-5 h-5 text-emerald-300" />,
    activeBorder: 'border-emerald-400/60 ring-emerald-500/30',
    glowColor: 'from-emerald-950/60 via-slate-900 to-slate-950',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  Dhuhr: {
    period: 'Midday • الزوال',
    rakats: '4 Sunnah + 4 Fard + 2 Sunnah',
    icon: <Sun className="w-5 h-5 text-amber-300" />,
    activeBorder: 'border-amber-400/60 ring-amber-500/30',
    glowColor: 'from-amber-950/50 via-slate-900 to-slate-950',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  Asr: {
    period: 'Afternoon • العصر',
    rakats: '4 Fard',
    icon: <Sun className="w-5 h-5 text-orange-300" />,
    activeBorder: 'border-orange-400/60 ring-orange-500/30',
    glowColor: 'from-orange-950/50 via-slate-900 to-slate-950',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  },
  Maghrib: {
    period: 'Sunset • الغروب',
    rakats: '3 Fard + 2 Sunnah',
    icon: <Sunset className="w-5 h-5 text-rose-300" />,
    activeBorder: 'border-rose-400/60 ring-rose-500/30',
    glowColor: 'from-rose-950/50 via-slate-900 to-slate-950',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  Isha: {
    period: 'Nightfall • العشاء',
    rakats: '4 Fard + 2 Sunnah + 3 Witr',
    icon: <Moon className="w-5 h-5 text-indigo-300" />,
    activeBorder: 'border-indigo-400/60 ring-indigo-500/30',
    glowColor: 'from-indigo-950/60 via-slate-900 to-slate-950',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  }
};

export const PrayerCard: React.FC<PrayerCardProps> = ({
  name,
  arabicName,
  time,
  status,
  isNext = false,
  onOpenConfirm,
  onQuickToggle
}) => {
  const isCompleted = status === 'completed';
  const isMissed = status === 'missed';
  const isLate = status === 'late';
  const theme = PRAYER_THEMES[name];

  return (
    <div
      onClick={() => onOpenConfirm(name)}
      className={`group relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer border select-none flex flex-col justify-between min-h-[220px] ${
        isCompleted
          ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border-emerald-500/50 shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/20'
          : isNext
          ? 'bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 border-amber-500/50 shadow-2xl shadow-amber-950/40 ring-1 ring-amber-500/30'
          : 'bg-slate-900/70 border-white/[0.08] hover:border-slate-700/90 hover:bg-slate-900/90 shadow-xl'
      }`}
    >
      {/* Top Illuminated Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 transition-all ${
          isCompleted
            ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-sm shadow-emerald-400/60'
            : isNext
            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-pulse shadow-sm shadow-amber-400/60'
            : 'bg-transparent group-hover:bg-slate-700/50'
        }`}
      />

      {/* Card Header: Icon & Arabic Calligraphy */}
      <div>
        <div className="flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner'
                : isNext
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
            }`}
          >
            {theme.icon}
          </div>

          <div className="text-right">
            <span className="font-calligraphy text-2xl text-amber-200/90 font-bold block leading-none">
              {arabicName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              {theme.period}
            </span>
          </div>
        </div>

        {/* Prayer Name & Time Display */}
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-extrabold text-xl text-white tracking-tight">{name}</h3>
            {isNext && (
              <span className="flex items-center gap-1 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Sparkles className="w-2.5 h-2.5" /> Next
              </span>
            )}
          </div>

          <div className="flex items-baseline space-x-1.5 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <p className="text-lg font-bold text-slate-200 tracking-wide font-mono">
              {time || '--:--'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer: Rakat Summary & Gratifying Quick Check Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
        <div className="text-[10px] text-slate-400">
          <span className="block font-semibold text-slate-300">{theme.rakats}</span>
          <span className={`inline-block mt-0.5 font-bold ${isCompleted ? 'text-emerald-400' : isNext ? 'text-amber-300' : 'text-slate-400'}`}>
            {isCompleted ? '✓ Completed' : isMissed ? 'Missed' : isLate ? 'Late (Qada)' : 'Pending'}
          </span>
        </div>

        <button
          type="button"
          title={isCompleted ? 'Mark not completed' : 'Mark completed on time'}
          onClick={(e) => onQuickToggle(name, e)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
            isCompleted
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 scale-105'
              : 'bg-slate-800/90 text-slate-400 border border-slate-700/80 hover:border-emerald-500/60 hover:text-emerald-300 hover:scale-110'
          }`}
        >
          <Check className={`w-5 h-5 stroke-[2.5] transition-transform ${isCompleted ? 'scale-100' : 'scale-75 opacity-40 group-hover:opacity-100'}`} />
        </button>
      </div>
    </div>
  );
};
