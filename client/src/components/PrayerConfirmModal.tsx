import React from 'react';
import { X, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { PrayerName, PrayerStatus } from '../types';

interface PrayerConfirmModalProps {
  isOpen: boolean;
  prayerName: PrayerName | null;
  currentStatus: PrayerStatus;
  onClose: () => void;
  onConfirm: (prayerName: PrayerName, status: PrayerStatus, notes?: string) => void;
}

export const PrayerConfirmModal: React.FC<PrayerConfirmModalProps> = ({
  isOpen,
  prayerName,
  currentStatus,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !prayerName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl shadow-emerald-950/30 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Prayer Log</span>
            <h3 className="text-xl font-bold text-slate-100">Did you complete {prayerName}?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-400 mt-3 mb-6">
          Record your prayer status to update your daily streak and consistency analytics.
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onConfirm(prayerName, 'completed')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-sm transition-all border ${
              currentStatus === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                : 'bg-slate-800/80 hover:bg-emerald-500/15 text-slate-200 hover:text-emerald-300 border-slate-700/60 hover:border-emerald-500/40'
            }`}
          >
            <span className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Completed on time</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Done ✓</span>
          </button>

          <button
            type="button"
            onClick={() => onConfirm(prayerName, 'late')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-sm transition-all border ${
              currentStatus === 'late'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800/80 hover:bg-amber-500/15 text-slate-200 hover:text-amber-300 border-slate-700/60 hover:border-amber-500/40'
            }`}
          >
            <span className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Completed Late (Qada / Made up)</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => onConfirm(prayerName, 'excused')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-sm transition-all border ${
              currentStatus === 'excused'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-800/80 hover:bg-indigo-500/15 text-slate-200 hover:text-indigo-300 border-slate-700/60 hover:border-indigo-500/40'
            }`}
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Excused (Valid Islamic Reason)</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => onConfirm(prayerName, 'missed')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-sm transition-all border ${
              currentStatus === 'missed'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800/80 hover:bg-rose-500/15 text-slate-200 hover:text-rose-300 border-slate-700/60 hover:border-rose-500/40'
            }`}
          >
            <span className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Not Completed / Missed</span>
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
