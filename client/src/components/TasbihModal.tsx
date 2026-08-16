import React, { useState } from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';

interface TasbihModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { text: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah' },
  { text: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'Praise be to Allah' },
  { text: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest' },
  { text: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'I seek forgiveness from Allah' },
  { text: 'La ilaha illallah', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', meaning: 'There is no god but Allah' }
];

export const TasbihModal: React.FC<TasbihModalProps> = ({ isOpen, onClose }) => {
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [activePreset, setActivePreset] = useState<number>(0);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState<number>(0);

  if (!isOpen) return null;

  const handleIncrement = () => {
    const nextCount = count + 1;
    if (nextCount >= target && target > 0) {
      setCount(0);
      setTotalCompletedCycles(prev => prev + 1);
      // Auto cycle through SubhanAllah -> Alhamdulillah -> Allahu Akbar if at preset 0
      if (activePreset < 2) {
        setActivePreset(prev => prev + 1);
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
  };

  const currentPhrase = PRESETS[activePreset];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl shadow-emerald-950/40 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Digital Dhikr</span>
            <span className="text-xs bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              {totalCompletedCycles} Cycles Done
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dhikr Preset Selection */}
        <div className="flex gap-1.5 overflow-x-auto py-3 no-scrollbar">
          {PRESETS.map((p, idx) => (
            <button
              key={p.text}
              onClick={() => {
                setActivePreset(idx);
                setCount(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-colors font-medium border ${
                activePreset === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {p.text}
            </button>
          ))}
        </div>

        {/* Current Dhikr Display */}
        <div className="my-4 py-2">
          <p className="font-arabic text-3xl text-emerald-400 font-bold mb-1 leading-relaxed">
            {currentPhrase.arabic}
          </p>
          <p className="text-base font-semibold text-slate-100">{currentPhrase.text}</p>
          <p className="text-xs text-slate-400 italic mt-0.5">{currentPhrase.meaning}</p>
        </div>

        {/* Interactive Tap Area / Counter Bead Ring */}
        <div className="my-4 flex flex-col items-center">
          <button
            type="button"
            onClick={handleIncrement}
            className="w-44 h-44 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-emerald-500/30 hover:border-emerald-500/60 flex flex-col items-center justify-center shadow-inner shadow-emerald-950/60 transform active:scale-95 transition-all group"
          >
            <span className="text-5xl font-black text-white group-hover:text-emerald-300 transition-colors">
              {count}
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1">
              Target: {target}
            </span>
          </button>
        </div>

        {/* Target and Reset controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Target:</span>
            {[33, 99, 100].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                  target === t ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
