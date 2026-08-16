import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { 
  CheckCircle2, 
  BookOpen, 
  TrendingUp, 
  Flame, 
  Sparkles,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { StatsResponse } from '../types';

export const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-slate-400">
        <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-3 animate-spin" />
        Calculating consistency analytics & spiritual trends...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Analytics & Insights</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Spiritual Consistency Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Visualizing your daily Salah devotion, Quran habits, and growth over time to keep you steadfast.
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Prayers Completed</span>
          <p className="text-2xl font-black text-white mt-1">
            {stats.prayers.totalCompleted}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">All 5 Daily Prayers Logged</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Quran Read</span>
          <p className="text-2xl font-black text-white mt-1">
            {stats.quran.totalPages} <span className="text-sm font-semibold text-slate-400">pages</span>
          </p>
          <span className="text-[11px] text-teal-400 font-medium">
            Across {stats.quran.totalReadingDays} active days ({stats.quran.avgPagesPerDay} pgs/day)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5 animate-flame" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Current Habit Streak</span>
          <p className="text-2xl font-black text-white mt-1">
            {stats.streak.current_streak} <span className="text-sm font-semibold text-slate-400">days</span>
          </p>
          <span className="text-[11px] text-amber-400 font-medium">
            Longest Record: {stats.streak.longest_streak} days
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Active Days</span>
          <p className="text-2xl font-black text-white mt-1">
            {stats.streak.total_active_days} <span className="text-sm font-semibold text-slate-400">days</span>
          </p>
          <span className="text-[11px] text-indigo-400 font-medium">Spiritual Accountability</span>
        </div>
      </div>

      {/* Individual Prayer Consistency Breakdown (Fajr, Dhuhr, Asr, Maghrib, Isha) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Consistency Rates</span>
            <h3 className="text-lg font-bold text-white">Prayer Consistency Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400">Based on all logged days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((name) => {
            const item = stats.prayers.consistency[name] || { completed: 0, percentage: 0 };
            return (
              <div
                key={name}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-100">{name}</span>
                    <span className="text-xs font-bold text-emerald-400">{item.percentage}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.completed} completed</p>
                </div>

                <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Prayer Completion (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Weekly Performance</span>
              <h3 className="text-base font-bold text-white">Prayers Completed (Last 7 Days)</h3>
            </div>
            <span className="text-xs text-slate-400">Max 5 / day</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} fontSize={12} />
                <YAxis stroke="#64748b" tickLine={false} domain={[0, 5]} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} / 5 prayers`, 'Completed']}
                />
                <Bar dataKey="prayers" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quran Reading Trend (Area Chart) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Quran Momentum</span>
              <h3 className="text-base font-bold text-white">Daily Pages Read (Past 30 Days)</h3>
            </div>
            <span className="text-xs text-teal-400 font-semibold">{stats.quran.totalPages} pgs total</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActivityTrend}>
                <defs>
                  <linearGradient id="quranGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="displayDate" stroke="#64748b" tickLine={false} fontSize={11} interval={4} />
                <YAxis stroke="#64748b" tickLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} pages`, 'Quran Read']}
                />
                <Area type="monotone" dataKey="quranPages" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#quranGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Month Monthly Consistency Trend (Area Chart) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Long-Term Consistency</span>
              <h3 className="text-base font-bold text-white">Monthly Salah Completion Rate (%)</h3>
            </div>
            <span className="text-xs text-slate-400">Past 6 Months</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend}>
                <defs>
                  <linearGradient id="monthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} fontSize={12} />
                <YAxis stroke="#64748b" tickLine={false} domain={[0, 100]} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Completion Rate']}
                />
                <Area type="monotone" dataKey="completionRate" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#monthGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
