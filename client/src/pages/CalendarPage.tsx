import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  X,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { MonthHistoryResponse, DayDetailResponse, CalendarDay } from '../types';

export const CalendarPage: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [historyData, setHistoryData] = useState<MonthHistoryResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetail, setDayDetail] = useState<DayDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDayLoading, setIsDayLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    api.getMonthHistory(year, month)
      .then(setHistoryData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayClick = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDayLoading(true);
    try {
      const res = await api.getDayDetail(dateStr);
      setDayDetail(res);
    } catch (err) {
      console.error('Failed to fetch day detail:', err);
    } finally {
      setIsDayLoading(false);
    }
  };

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Pad the start of the month for Sunday-aligned grid
  const firstDayOfWeek = historyData?.calendarDays[0]?.dayOfWeek || 0;
  const blanks = Array.from({ length: firstDayOfWeek });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Habit History</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Calendar & Consistency Logs</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any date to inspect individual prayer statuses and Quran reading sessions.
          </p>
        </div>

        {/* Month Navigation Buttons */}
        <div className="flex items-center space-x-3 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white px-2 min-w-[130px] text-center">
            {historyData?.monthName || `${month}/${year}`}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics Banner */}
      {historyData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">5/5 Full Days</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {historyData.summary.totalDaysWithFullPrayers} Days
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Salah Completed</span>
            <p className="text-xl font-bold text-teal-400 mt-1">
              {historyData.summary.totalMonthPrayers} Prayers
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Quran Read This Month</span>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {historyData.summary.totalMonthPages} Pages
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Monthly Consistency</span>
            <p className="text-xl font-bold text-indigo-400 mt-1">
              {historyData.summary.monthCompletionRate}%
            </p>
          </div>
        </div>
      )}

      {/* Calendar Grid Container */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 pb-4 border-b border-slate-800">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-4">
          {/* Leading blank days */}
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="min-h-[85px] sm:min-h-[105px] rounded-2xl bg-transparent opacity-10" />
          ))}

          {/* Actual days */}
          {historyData?.calendarDays.map((day: CalendarDay) => {
            const isFull = day.level === 'full';
            const isHigh = day.level === 'high';
            const isPartial = day.level === 'partial';

            return (
              <div
                key={day.date}
                onClick={() => handleDayClick(day.date)}
                className={`min-h-[85px] sm:min-h-[105px] p-2 sm:p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isFull
                    ? 'bg-emerald-950/25 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/30'
                    : isHigh
                    ? 'bg-teal-950/20 border-teal-500/30 hover:border-teal-400'
                    : isPartial
                    ? 'bg-amber-950/15 border-amber-500/25 hover:border-amber-400'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Top date and badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white">
                    {day.dayNumber}
                  </span>
                  {isFull && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  )}
                </div>

                {/* Day status stats */}
                <div className="space-y-1 my-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-400">Salah:</span>
                    <span
                      className={`font-bold ${
                        isFull
                          ? 'text-emerald-300 font-extrabold'
                          : day.completedPrayers > 0
                          ? 'text-amber-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {day.completedPrayers}/5
                    </span>
                  </div>

                  {day.quranPages > 0 && (
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-teal-300 font-medium truncate">
                      <span>Quran:</span>
                      <span>{day.quranPages}p</span>
                    </div>
                  )}
                </div>

                {/* Bottom visual indicator bar */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFull
                        ? 'bg-emerald-400'
                        : isHigh
                        ? 'bg-teal-400'
                        : isPartial
                        ? 'bg-amber-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${(day.completedPrayers / 5) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500/40 border border-emerald-500" />
            <span>5/5 Completed (Full)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-md bg-teal-500/30 border border-teal-500" />
            <span>3-4 Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500" />
            <span>1-2 Completed (Partial)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
            <span>No Activity Logged</span>
          </div>
        </div>
      </div>

      {/* Day Details Inspection Modal / Drawer */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Daily Log Summary</span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDayLoading ? (
              <div className="py-12 text-center text-sm text-slate-400">
                Loading daily breakdown...
              </div>
            ) : dayDetail ? (
              <div className="mt-6 space-y-6">
                {/* Overview Score Pill */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                      {dayDetail.prayerScore}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Prayer Completion Score</p>
                      <p className="text-xs text-slate-400">{dayDetail.completionPercentage}% of daily prayers completed</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {dayDetail.completedCount === 5 ? 'All Complete 🌟' : `${dayDetail.completedCount} Done`}
                  </span>
                </div>

                {/* 5 Prayers Breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Salah Record
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dayDetail.prayers.map((p) => {
                      const isCompleted = p.status === 'completed';
                      return (
                        <div
                          key={p.name}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium ${
                            isCompleted
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                          }`}
                        >
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-[11px] font-bold">
                            {isCompleted ? '✓ Completed' : p.status === 'missed' ? '✗ Missed' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quran Reading Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Quran Reading ({dayDetail.totalQuranPages} Pages Total)
                  </h4>
                  {dayDetail.quranLogs.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {dayDetail.quranLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-slate-200">{log.surah_name || 'General Reading'}</p>
                            {log.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">{log.notes}</p>}
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <span className="font-bold text-teal-400">{log.pages_read} pages</span>
                            <span className="text-[11px] text-slate-400 block">{log.reading_duration_mins} mins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                      No Quran reading logged for this day.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            <div className="mt-6 pt-4 border-t border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
