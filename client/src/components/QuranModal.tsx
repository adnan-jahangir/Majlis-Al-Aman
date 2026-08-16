import React, { useState } from 'react';
import { X, BookOpen, Clock } from 'lucide-react';
import { api } from '../services/api';

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultPages?: number;
}

export const QuranModal: React.FC<QuranModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultPages = 10
}) => {
  const [pagesRead, setPagesRead] = useState<number | ''>(defaultPages);
  const [durationMins, setDurationMins] = useState<number | ''>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagesRead || Number(pagesRead) <= 0) {
      setError('Please enter a valid number of pages');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.logQuranReading({
        pagesRead: Number(pagesRead),
        durationMins: durationMins ? Number(durationMins) : 0
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save Quran reading');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl shadow-emerald-950/30 transform transition-all space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-cinzel">Quran Tilawah</span>
              <h3 className="text-xl font-bold text-slate-100">Log Daily Tilawah</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pages Read (Main Input) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">
              Pages Read Today (কত পৃষ্ঠা পঠিত) <span className="text-teal-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="604"
                required
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 10"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-base font-bold focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all placeholder:font-normal"
              />
              <span className="absolute right-4 top-3 text-xs text-teal-300 font-bold uppercase tracking-wider pointer-events-none">
                Pages / পৃষ্ঠা
              </span>
            </div>
          </div>

          {/* Duration in Minutes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Time Spent (সময় - মিনিট)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={durationMins}
                onChange={(e) => setDurationMins(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 20"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-teal-400 transition-all"
              />
              <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-medium pointer-events-none">
                Minutes
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-950/40 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Tilawah ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
