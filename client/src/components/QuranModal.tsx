import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, FileText } from 'lucide-react';
import { Surah } from '../types';
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
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | ''>(18); // Default Surah Al-Kahf
  const [pagesRead, setPagesRead] = useState<number | ''>(defaultPages);
  const [durationMins, setDurationMins] = useState<number | ''>(20);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && surahs.length === 0) {
      api.getSurahs().then(setSurahs).catch(console.error);
    }
  }, [isOpen, surahs.length]);

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
      const selectedSurah = surahs.find(s => s.number === Number(selectedSurahNumber));
      const surahName = selectedSurah ? `${selectedSurah.number}. ${selectedSurah.name} (${selectedSurah.english})` : undefined;

      await api.logQuranReading({
        pagesRead: Number(pagesRead),
        surahNumber: selectedSurahNumber ? Number(selectedSurahNumber) : undefined,
        surahName,
        durationMins: durationMins ? Number(durationMins) : 0,
        notes: notes.trim() || undefined
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
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl shadow-emerald-950/30 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Quran Habit</span>
              <h3 className="text-xl font-bold text-slate-100">Log Quran Reading</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Surah Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Surah (Chapter)
            </label>
            <select
              value={selectedSurahNumber}
              onChange={(e) => setSelectedSurahNumber(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">General Recitation / Multiple Surahs</option>
              {surahs.map((s) => (
                <option key={s.number} value={s.number}>
                  Surah {s.number}: {s.name} — {s.english} ({s.totalAyahs} Ayahs)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Pages Read */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Pages Read <span className="text-emerald-400">*</span>
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                  pages
                </span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Reading Duration
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 20"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                  mins
                </span>
              </div>
            </div>
          </div>

          {/* Notes / Reflections */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Reflection / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reflections on the verses, key lessons, or memorization progress..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none placeholder:text-slate-500"
            />
          </div>

          {/* Quick Page Preset Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Quick add:</span>
            {[2, 5, 10, 20].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPagesRead(p);
                  setDurationMins(p * 2);
                }}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-slate-700 transition-colors"
              >
                +{p} pages
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Reading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
