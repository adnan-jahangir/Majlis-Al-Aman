import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  List, 
  Layers,
  Sparkles
} from 'lucide-react';
import { MORNING_EVENING_ADHKAR, AdhkarItem } from '../data/adhkarData';

interface AdhkarModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTime?: 'morning' | 'evening';
}

export const AdhkarModal: React.FC<AdhkarModalProps> = ({
  isOpen,
  onClose,
  defaultTime = 'morning'
}) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>(defaultTime);
  const [viewMode, setViewMode] = useState<'focused' | 'list'>('focused');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showMeaning, setShowMeaning] = useState<boolean>(true);

  const todayKey = `majlis_adhkar_${new Date().toISOString().split('T')[0]}`;

  // Load saved counts for today
  useEffect(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        setCounts(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load saved adhkar:', e);
    }
  }, [todayKey]);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Save counts
  const saveCounts = (updated: Record<string, number>) => {
    setCounts(updated);
    try {
      localStorage.setItem(todayKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save adhkar:', e);
    }
  };

  const currentList = MORNING_EVENING_ADHKAR.filter((item) => item.category === activeTab);
  const currentItem = currentList[currentIndex] || currentList[0];

  const completedCount = currentList.filter((item) => (counts[item.id] || 0) >= item.count).length;
  const progressPercent = currentList.length > 0 ? Math.round((completedCount / currentList.length) * 100) : 0;

  const handleIncrement = (item: AdhkarItem) => {
    const current = counts[item.id] || 0;
    if (current < item.count) {
      const next = current + 1;
      const updated = { ...counts, [item.id]: next };
      saveCounts(updated);

      // Mobile haptic vibration feedback
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        try {
          navigator.vibrate(next >= item.count ? [50, 70, 50] : 35);
        } catch (_) {}
      }

      // Auto advance to next adhkar if completed in focused view
      if (next >= item.count && viewMode === 'focused' && currentIndex < currentList.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => Math.min(prev + 1, currentList.length - 1));
        }, 600);
      }
    }
  };

  const handleResetSection = () => {
    const updated = { ...counts };
    currentList.forEach((item) => {
      delete updated[item.id];
    });
    saveCounts(updated);
    setCurrentIndex(0);
  };

  if (!isOpen) return null;

  const itemCurrentCount = counts[currentItem?.id] || 0;
  const itemIsDone = itemCurrentCount >= (currentItem?.count || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[96vh] sm:max-h-[90vh] rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-950/60 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className={`absolute -top-20 -right-20 w-48 h-48 ${activeTab === 'morning' ? 'bg-amber-500/15' : 'bg-indigo-500/15'} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />

        {/* Top Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeTab === 'morning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
              {activeTab === 'morning' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                Daily Masnoon Adhkar
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Hisn al-Muslim
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {activeTab === 'morning' ? 'Morning Protection & Remembrance' : 'Evening Peace & Supplication'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Sub-header (Tabs + View Switcher + Progress) */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/70 shrink-0 space-y-2.5">
          {/* Tab & View Mode row */}
          <div className="flex items-center gap-2">
            {/* Morning / Evening Toggle */}
            <div className="flex flex-1 rounded-xl bg-slate-900 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('morning')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'morning'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Morning (সকাল)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('evening')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'evening'
                    ? 'bg-indigo-500 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Evening (সন্ধ্যা)</span>
              </button>
            </div>

            {/* Focused vs List View Toggle */}
            <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('focused')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'focused' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Single Card Focused Mode (Mobile Friendly)"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="All Cards List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Mini Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-300">
              Progress: <strong className="text-emerald-400">{completedCount}</strong> of {currentList.length} completed
            </span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-mono font-bold">{progressPercent}%</span>
              <button
                type="button"
                onClick={handleResetSection}
                className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW MODE 1: FOCUSED 1-CARD SLIDER (MOBILE FIRST & CLEAN) */}
        {/* ============================================================ */}
        {viewMode === 'focused' && currentItem && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Index & Jump Navigation */}
            <div className="px-4 py-2 bg-slate-900/60 flex items-center justify-between border-b border-slate-800/40 shrink-0 text-xs">
              <span className="font-bold text-amber-300 font-cinzel">
                Adhkar {currentIndex + 1} of {currentList.length}
              </span>

              {/* Jump Dots */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] py-1">
                {currentList.map((item, idx) => {
                  const isDone = (counts[item.id] || 0) >= item.count;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        isCurrent 
                          ? 'w-5 bg-amber-400' 
                          : isDone 
                            ? 'w-2 bg-emerald-400' 
                            : 'w-2 bg-slate-700'
                      }`}
                      title={item.title}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scrollable Single Adhkar Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {/* Title & Ref */}
              <div className="border-b border-slate-800/80 pb-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {currentItem.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  {currentItem.reference}
                </span>
              </div>

              {/* Full Arabic Text */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner">
                <p className="font-calligraphy text-xl sm:text-2xl text-amber-200 font-bold leading-loose text-right dir-rtl select-text">
                  {currentItem.arabic}
                </p>
              </div>

              {/* Bangla Pronunciation Card (বাংলা উচ্চারণ) */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  বাংলা সঠিক উচ্চারণ:
                </span>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed whitespace-pre-line select-text">
                  {currentItem.banglaPronunciation}
                </p>
              </div>

              {/* Toggleable English Meaning & Virtue */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowMeaning(!showMeaning)}
                  className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-2"
                >
                  <span>{showMeaning ? '▼ Hide Meaning & Virtue' : '► Show English Meaning & Virtue'}</span>
                </button>

                {showMeaning && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <p className="text-xs text-slate-300 leading-relaxed pl-1">
                      <strong>Meaning:</strong> {currentItem.english}
                    </p>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-2 text-[11px] text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Virtue:</strong> {currentItem.benefit}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Giant Tap Counter & Prev/Next Bar (Mobile Thumb Zone) */}
            <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2.5">
              <button
                type="button"
                onClick={() => handleIncrement(currentItem)}
                className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base transition-all transform active:scale-95 flex items-center justify-center space-x-2 shadow-xl ${
                  itemIsDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30'
                }`}
              >
                {itemIsDone ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Completed ({currentItem.count}x / {currentItem.count}x) ✓</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>TAP TO COUNT: {itemCurrentCount} / {currentItem.count}</span>
                  </>
                )}
              </button>

              {/* Prev / Next Buttons */}
              <div className="flex items-center justify-between gap-3 text-xs font-bold">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === currentList.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, currentList.length - 1))}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Next Adhkar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW MODE 2: COMPACT LIST VIEW */}
        {/* ============================================================ */}
        {viewMode === 'list' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {currentList.map((item, idx) => {
              const currentCount = counts[item.id] || 0;
              const isDone = currentCount >= item.count;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-inner'
                      : 'bg-slate-800/40 hover:bg-slate-800/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center border border-slate-700">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">{item.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 block pl-7">
                        {item.reference}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleIncrement(item)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      }`}
                    >
                      {isDone ? `✓ Done (${item.count}x)` : `Tap: ${currentCount}/${item.count}`}
                    </button>
                  </div>

                  <div className="my-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="font-calligraphy text-lg sm:text-xl text-amber-200 font-bold leading-loose text-right dir-rtl select-text">
                      {item.arabic}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 mb-2">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">
                      বাংলা উচ্চারণ:
                    </span>
                    <p className="text-xs text-emerald-100 font-medium leading-relaxed whitespace-pre-line">
                      {item.banglaPronunciation}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Meaning:</strong> {item.english}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
