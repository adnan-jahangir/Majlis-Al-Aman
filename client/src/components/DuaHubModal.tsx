import React from 'react';
import { 
  X, 
  Sun, 
  Sparkles, 
  Compass, 
  BookHeart,
  ChevronRight
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
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-950/70 overflow-hidden relative animate-in slide-in-from-bottom-6 duration-250"
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-inner">
              <BookHeart className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                Dua & Dhikr Hub
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  দোয়া ও যিকির
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose a spiritual tool or supplication
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

        {/* Action Hub Options - MuslimDay Grid Style */}
        <div className="p-4 sm:p-6 pb-8 sm:pb-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* 1. Daily Masnoon Adhkar */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdhkar();
              }}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-800/60 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-500/50 transition-all group active:scale-95 shadow-md text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 group-hover:bg-amber-500/25 transition-all shadow-inner">
                <Sun className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Daily Adhkar
              </h4>
              <span className="text-[10px] text-amber-400/90 font-semibold mt-1">
                সকাল ও সন্ধ্যা
              </span>
            </button>

            {/* 2. Digital Tasbih Counter */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTasbih();
              }}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-800/60 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group active:scale-95 shadow-md text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all shadow-inner">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Tasbih Counter
              </h4>
              <span className="text-[10px] text-emerald-400/90 font-semibold mt-1">
                ডিজিটাল তাসবীহ
              </span>
            </button>

            {/* 3. Qibla Compass */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQibla();
              }}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-800/60 hover:bg-teal-500/15 border border-teal-500/30 hover:border-teal-500/50 transition-all group active:scale-95 shadow-md text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 group-hover:bg-teal-500/25 transition-all shadow-inner">
                <Compass className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                Qibla Compass
              </h4>
              <span className="text-[10px] text-teal-400/90 font-semibold mt-1">
                কিবলা দিক
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
