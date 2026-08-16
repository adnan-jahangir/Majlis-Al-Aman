import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Lock, User as UserIcon, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { LeaderboardItem, LeaderboardUserDetail } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from '../components/UserProfileModal';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'today' | 'this_week' | 'this_month' | 'all_time'>('today');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected User Modal State
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<LeaderboardUserDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    api.getLeaderboard(timeframe)
      .then((res) => {
        setLeaderboard(res.leaderboard || []);
        setUserRank(res.userRank);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [timeframe]);

  const handleOpenUserDetail = async (userId: number) => {
    setSelectedUserId(userId);
    setIsDetailLoading(true);
    try {
      const detail = await api.getUserLeaderboardDetail(userId);
      setSelectedUserDetail(detail);
    } catch (err) {
      console.error('Failed to load user leaderboard detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseUserDetail = () => {
    setSelectedUserId(null);
    setSelectedUserDetail(null);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return (
      <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-slate-300">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>Spiritual Encouragement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Consistency Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            A peaceful motivation board focused on individual steadfastness and building lifelong Islamic discipline.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex flex-wrap rounded-2xl bg-slate-950/90 p-1.5 border border-slate-800/90 self-start sm:self-auto gap-1 shadow-inner">
          {[
            { id: 'today', label: 'Today', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'this_week', label: 'This Week', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'this_month', label: 'This Month', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'all_time', label: 'All Time', icon: <Trophy className="w-3.5 h-3.5 text-amber-300" /> }
          ].map((tab) => {
            const isActive = timeframe === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
                }`}
              >
                <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium Highlights (Interactive Clickable Cards) */}
      {leaderboard.length >= 3 && leaderboard[0].score > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place */}
          <div
            onClick={() => handleOpenUserDetail(leaderboard[1].id)}
            className="p-6 rounded-3xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 flex flex-col items-center text-center order-2 md:order-1 relative overflow-hidden cursor-pointer transition-all duration-200 group hover:scale-[1.02] shadow-xl"
            title="Click to view user's prayer & Quran progress"
          >
            <span className="text-3xl mb-2">🥈</span>
            <img
              src={leaderboard[1].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaderboard[1].username}`}
              alt={leaderboard[1].name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-400 mb-2 group-hover:border-emerald-400 transition-colors"
            />
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">{leaderboard[1].name}</h3>
            <p className="text-xs text-slate-400">@{leaderboard[1].username}</p>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                {leaderboard[1].prayerConsistency}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                🔥 {leaderboard[1].streak}d
              </span>
            </div>
            <span className="mt-3 text-[10px] text-slate-500 font-medium group-hover:text-emerald-400 transition-colors">
              Click to view progress →
            </span>
          </div>

          {/* 1st Place */}
          <div
            onClick={() => handleOpenUserDetail(leaderboard[0].id)}
            className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-900 hover:from-amber-500/25 border-2 border-amber-500/50 flex flex-col items-center text-center order-1 md:order-2 shadow-2xl shadow-amber-950/30 relative overflow-hidden cursor-pointer transition-all duration-200 group hover:scale-[1.02]"
            title="Click to view champion's prayer & Quran progress"
          >
            <span className="text-4xl mb-2">🥇</span>
            <div className="relative">
              <img
                src={leaderboard[0].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaderboard[0].username}`}
                alt={leaderboard[0].name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 mb-2 shadow-lg shadow-amber-500/30"
              />
              <span className="absolute -top-2 -right-2 text-xs">👑</span>
            </div>
            <h3 className="font-bold text-lg text-white mt-1 group-hover:text-amber-300 transition-colors">{leaderboard[0].name}</h3>
            <p className="text-xs text-amber-300 font-medium">@{leaderboard[0].username}</p>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                {leaderboard[0].prayerConsistency}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                🔥 {leaderboard[0].streak}d
              </span>
            </div>
            <span className="mt-3 text-[10px] text-amber-400/90 font-medium group-hover:text-amber-200 transition-colors">
              Click to view progress →
            </span>
          </div>

          {/* 3rd Place */}
          <div
            onClick={() => handleOpenUserDetail(leaderboard[2].id)}
            className="p-6 rounded-3xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 flex flex-col items-center text-center order-3 relative overflow-hidden cursor-pointer transition-all duration-200 group hover:scale-[1.02] shadow-xl"
            title="Click to view user's prayer & Quran progress"
          >
            <span className="text-3xl mb-2">🥉</span>
            <img
              src={leaderboard[2].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaderboard[2].username}`}
              alt={leaderboard[2].name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-700 mb-2 group-hover:border-emerald-400 transition-colors"
            />
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">{leaderboard[2].name}</h3>
            <p className="text-xs text-slate-400">@{leaderboard[2].username}</p>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                {leaderboard[2].prayerConsistency}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                🔥 {leaderboard[2].streak}d
              </span>
            </div>
            <span className="mt-3 text-[10px] text-slate-500 font-medium group-hover:text-emerald-400 transition-colors">
              Click to view progress →
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table Container */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-400">
            Updating leaderboard ranks...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Activity Logged Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start logging your daily prayers and Quran reading on the Dashboard to climb the consistency ranks!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-4 px-5">Rank</th>
                  <th className="py-4 px-5">User (Click to View)</th>
                  <th className="py-4 px-5">Prayers Completed</th>
                  <th className="py-4 px-5">Quran Days / Pages</th>
                  <th className="py-4 px-5">Streak</th>
                  <th className="py-4 px-5 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenUserDetail(item.id)}
                    className={`transition-colors cursor-pointer group ${
                      item.isCurrentUser
                        ? 'bg-emerald-950/30 hover:bg-emerald-950/50 font-semibold'
                        : 'hover:bg-slate-800/60'
                    }`}
                    title={`Click to inspect @${item.username}'s Namaz & Quran progress`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {getRankBadge(item.rank)}
                    </td>

                    {/* User */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`}
                          alt={item.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">{item.name}</span>
                            {item.isCurrentUser && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">@{item.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Prayers Completed */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {item.prayerConsistency === 'Private' ? (
                        <span className="text-slate-500 text-xs italic">Private</span>
                      ) : (
                        <div className="flex items-baseline space-x-1.5">
                          <span className="font-extrabold text-emerald-400 text-sm">
                            {item.prayerCompleted}/{item.totalTargetPrayers || (timeframe === 'today' ? 5 : 35)}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            ({item.prayerConsistency})
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Quran Days / Pages */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="text-slate-300">
                        {item.quranPages > 0 ? `${item.quranPages} pgs (${item.quranDays}d)` : '—'}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 text-amber-400 font-bold">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>{item.streak}d</span>
                      </span>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-xs group-hover:border-emerald-500/40">
                          {item.score} pts
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Profile Detail Modal */}
      <UserProfileModal
        isOpen={!!selectedUserId}
        onClose={handleCloseUserDetail}
        userDetail={selectedUserDetail}
        isLoading={isDetailLoading}
      />

      {/* Privacy Notice Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Click on any user in the leaderboard to view their daily Namaz & Quran tilawah stats! You can control your own privacy in <strong>Settings → Privacy</strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
