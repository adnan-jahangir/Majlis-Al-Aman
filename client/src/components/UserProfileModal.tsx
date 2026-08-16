import React from 'react';
import { X, Flame, BookOpen, CheckCircle2, Shield, Calendar, Award, Sparkles, Clock, Lock } from 'lucide-react';
import { LeaderboardUserDetail, PrayerName } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetail: LeaderboardUserDetail | null;
  isLoading: boolean;
}

const ARABIC_PRAYER_NAMES: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

const BADGE_DESCRIPTIONS: Record<string, { label: string; icon: string; bg: string }> = {
  fajr_pioneer: { label: 'Fajr Pioneer', icon: '🌅', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  streak_7: { label: '7-Day Istiqamah', icon: '🔥', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  streak_30: { label: '30-Day Devotion', icon: '⚡', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  quran_khatam_1: { label: 'Quran Khatam', icon: '📖', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  prayer_master_100: { label: '100 Prayers', icon: '🕌', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  early_bird: { label: 'Early Worshipper', icon: '✨', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userDetail,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top Illuminated Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-slate-400 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
            <p>Loading spiritual details...</p>
          </div>
        ) : !userDetail ? (
          <div className="py-12 text-center text-slate-400">
            Failed to load user profile.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Profile Info */}
            <div className="flex items-center space-x-4">
              <img
                src={userDetail.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userDetail.user.username}`}
                alt={userDetail.user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/40 shrink-0"
              />
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white tracking-tight truncate">{userDetail.user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Member
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">@{userDetail.user.username}</p>
                <p className="text-xs text-slate-300 italic line-clamp-2">"{userDetail.user.bio}"</p>
              </div>
            </div>

            {/* Streak Summary Strip */}
            <div className="grid grid-cols-3 gap-2.5 text-center p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Streak</span>
                <span className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {userDetail.user.streak.current_streak}d
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Longest</span>
                <span className="text-base font-extrabold text-slate-200">
                  {userDetail.user.streak.longest_streak}d
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Days</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {userDetail.user.streak.total_active_days}d
                </span>
              </div>
            </div>

            {/* Today's Prayers Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Today's Prayer Status</h4>
                </div>
                {userDetail.privacy.showPrayerStats && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {userDetail.todayCompletedCount} / 5 Completed
                  </span>
                )}
              </div>

              {!userDetail.privacy.showPrayerStats ? (
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>This user has set prayer statistics to private.</span>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-1.5">
                  {userDetail.todayPrayers.map((p) => {
                    const isDone = p.status === 'completed';
                    return (
                      <div
                        key={p.name}
                        className={`p-2 rounded-2xl text-center border transition-all ${
                          isDone
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950/50 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="font-calligraphy text-xs block text-amber-200/90 font-bold">
                          {ARABIC_PRAYER_NAMES[p.name]}
                        </span>
                        <p className="text-[10px] font-semibold mt-0.5">{p.name}</p>
                        <span className="text-xs font-bold block mt-0.5">{isDone ? '✓' : '○'}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daily & Total Quran Stats */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Noble Quran Progress</h4>
              </div>

              {!userDetail.privacy.showQuranStats ? (
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>This user has set Quran statistics to private.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/30">
                    <span className="text-[10px] text-teal-300 uppercase font-bold block">Today's Tilawah</span>
                    <p className="text-lg font-extrabold text-white mt-0.5">
                      {userDetail.quranStats.todayPages} <span className="text-xs text-slate-400 font-normal">Pages</span>
                    </p>
                    <span className="text-[11px] text-slate-400">{userDetail.quranStats.todayDuration} mins spent</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Quran Read</span>
                    <p className="text-lg font-extrabold text-white mt-0.5">
                      {userDetail.quranStats.totalPages} <span className="text-xs text-slate-400 font-normal">Pages</span>
                    </p>
                    <span className="text-[11px] text-teal-400 font-semibold">Lifetime Tilawah</span>
                  </div>
                </div>
              )}
            </div>

            {/* Achievements Shelf */}
            {userDetail.achievements && userDetail.achievements.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Unlocked Badges</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userDetail.achievements.map((key) => {
                    const badge = BADGE_DESCRIPTIONS[key] || { label: key, icon: '🏆', bg: 'bg-slate-800 text-slate-200 border-slate-700' };
                    return (
                      <span
                        key={key}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${badge.bg}`}
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
