import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Trophy, 
  Calendar, 
  Sparkles, 
  Edit3, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { StatsResponse } from '../types';

const BADGE_CONFIG: Record<string, { title: string; desc: string; icon: string; category: string }> = {
  streak_3: { title: '3-Day Momentum', desc: 'Maintained a 3-day spiritual habit streak', icon: '🌱', category: 'Streaks' },
  streak_7: { title: '7-Day Steadfastness', desc: 'Completed a full week streak', icon: '🔥', category: 'Streaks' },
  streak_14: { title: '14-Day Consistency', desc: 'Fortified your routine for two weeks', icon: '✨', category: 'Streaks' },
  streak_30: { title: '30-Day Master', desc: 'One month of uninterrupted consistency', icon: '🏆', category: 'Streaks' },
  streak_100: { title: '100-Day Centurion', desc: 'A monumental hundred-day journey', icon: '👑', category: 'Streaks' },
  prayers_10: { title: 'First 10 Prayers', desc: 'Logged first 10 completed prayers', icon: '🤲', category: 'Prayers' },
  prayers_50: { title: '50 Salah Milestone', desc: 'Reached 50 recorded prayers', icon: '🕌', category: 'Prayers' },
  prayers_100: { title: '100 Salah Century', desc: 'Completed 100 on-time prayers', icon: '💎', category: 'Prayers' },
  prayers_500: { title: '500 Salah Devotion', desc: 'Prostrated 500 times with devotion', icon: '🌟', category: 'Prayers' },
  fajr_champion: { title: 'Fajr Champion', desc: 'Consistently prayed Fajr for 7+ days', icon: '🌅', category: 'Prayers' },
  quran_starter: { title: 'Quran Starter', desc: 'Logged your first Quran reading session', icon: '📖', category: 'Quran' },
  quran_50: { title: '50 Quran Pages', desc: 'Read over 50 pages of the Holy Quran', icon: '📜', category: 'Quran' },
  quran_100: { title: '100 Quran Pages', desc: 'Read over 100 pages of the Holy Quran', icon: '🌿', category: 'Quran' },
  khatam_club: { title: 'Khatam Club', desc: 'Completed a full recitation of 604 pages', icon: '🕋', category: 'Quran' }
};

export const ProfilePage: React.FC = () => {
  const { user, streak, achievements, updateUser } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
    api.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile({ name, bio, avatar });
      updateUser(res.user);
      setIsEditing(false);
      showToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to update profile', type: 'error' });
    }
  };

  const unlockedBadges = new Set(achievements);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/30"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
                {user?.role === 'admin' && (
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">@{user?.username}</p>
              <p className="text-xs text-slate-300 mt-2 max-w-lg leading-relaxed">
                {user?.bio || 'Building consistency in daily Salah and Quran reflections.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Goals</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub-Style Annual Activity Heatmap (365 Days) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Habit Heatmap</span>
            <h3 className="text-lg font-bold text-white">365-Day Spiritual Activity</h3>
          </div>
          <span className="text-xs text-slate-400">
            Total active days: <strong className="text-emerald-400 font-bold">{streak?.total_active_days || 0}</strong>
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[720px]">
            {stats?.heatmap?.map((day, idx) => {
              let bg = 'bg-slate-800/40 border-slate-800';
              if (day.level === 4) bg = 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/50';
              else if (day.level === 3) bg = 'bg-emerald-600 border-emerald-500';
              else if (day.level === 2) bg = 'bg-emerald-800/80 border-emerald-700';
              else if (day.level === 1) bg = 'bg-emerald-950 border-emerald-900';

              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.prayers} prayers completed, ${day.quranPages} Quran pages`}
                  className={`w-3.5 h-3.5 rounded-sm border ${bg} transition-transform hover:scale-125 cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-end space-x-2 mt-4 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-800/40 border border-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950 border border-emerald-900" />
          <div className="w-3 h-3 rounded-sm bg-emerald-800 border border-emerald-700" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300" />
          <span>More (5/5)</span>
        </div>
      </div>

      {/* Achievements / Badges Trophy Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Milestones</span>
            <h3 className="text-lg font-bold text-white">Spiritual Achievements & Badges</h3>
          </div>
          <span className="text-xs font-bold text-amber-400">
            {achievements.length} / {Object.keys(BADGE_CONFIG).length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(BADGE_CONFIG).map(([key, badge]) => {
            const isUnlocked = unlockedBadges.has(key);

            return (
              <div
                key={key}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20 hover:scale-102'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-40 grayscale'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{badge.title}</h4>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {badge.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{badge.desc}</p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isUnlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
