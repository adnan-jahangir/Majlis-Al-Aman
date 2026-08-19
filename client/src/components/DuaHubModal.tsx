import React from 'react';
import { 
  X, 
  Sun, 
  Sparkles, 
  Compass, 
  BookHeart, 
  ChevronRight, 
  ShieldCheck,
  Moon
} from 'lucide-react';

interface DuaHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdhkar: () => void;
  onOpenTasbih: () => void;
  onOpenQibla: () => void;
}

export const DuaHubModal: React.FC<DuaHubModalProps> = ({
  isOpen,
  onClose,
  onOpenAdhkar,
  onOpenTasbih,
  onOpenQibla
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-950/70 overflow-hidden relative animate-in slide-in-from-bottom-6 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Grab Handle for Mobile Sheet */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <BookHeart className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                Dua & Remembrance Hub
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  অ্যাযকার ও দু'আ
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Daily supplications, digital tasbih & tools
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Hub Options Grid */}
        <div className="p-4 sm:p-5 space-y-3 pb-8 sm:pb-5">
          {/* 1. Daily Morning & Evening Adhkar */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAdhkar();
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-800/60 to-slate-800/40 hover:from-amber-500/25 hover:to-slate-800/80 border border-amber-500/30 transition-all flex items-center justify-between text-left group active:scale-98 shadow-sm"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-inner">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Daily Masnoon Adhkar
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                    সকাল ও সন্ধ্যা
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ayat al-Kursi, Sayyidul Istighfar, 3 Quls & 1-tap counter
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 2. Digital Tasbih Counter */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTasbih();
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-800/60 to-slate-800/40 hover:from-emerald-500/25 hover:to-slate-800/80 border border-emerald-500/30 transition-all flex items-center justify-between text-left group active:scale-98 shadow-sm"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Digital Tasbih & Dhikr
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    ডিজিটাল তাসবীহ
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Custom targets (33x, 100x), sound, vibration & preset adhkar
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 3. Qibla Compass */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenQibla();
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-slate-800/60 to-slate-800/40 hover:from-teal-500/25 hover:to-slate-800/80 border border-teal-500/30 transition-all flex items-center justify-between text-left group active:scale-98 shadow-sm"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform shadow-inner">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    Qibla Compass Direction
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold">
                    কিবলা দিক
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live GPS Kaaba degree bearing and calibration
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
