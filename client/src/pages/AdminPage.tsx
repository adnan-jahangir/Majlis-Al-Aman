import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Search,
  Megaphone,
  UserCheck,
  UserX
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AdminMetrics, Announcement } from '../types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [search, setSearch] = useState('');
  
  // New Announcement
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [mRes, uRes, aRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminUsers(search),
        api.getAnnouncements()
      ]);
      setMetrics(mRes);
      setUsersList(uRes.users);
      setAnnouncements(aRes.announcements);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleSearchUsers = (e: React.FormEvent) => {
    e.preventDefault();
    api.getAdminUsers(search).then(res => setUsersList(res.users)).catch(console.error);
  };

  const handleToggleUserStatus = async (targetUserId: number) => {
    try {
      const res = await api.toggleUserStatus(targetUserId);
      setUsersList(prev => prev.map(u => {
        if (u.id === targetUserId) {
          return { ...u, is_disabled: res.isDisabled };
        }
        return u;
      }));
      showToast({ message: res.message, type: 'info' });
    } catch (err: any) {
      showToast({ message: err.message || 'Action failed', type: 'error' });
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingAnnouncement(true);
    try {
      const res = await api.createAnnouncement({ title: newTitle, content: newContent });
      setAnnouncements([res.announcement, ...announcements]);
      setNewTitle('');
      setNewContent('');
      showToast({ message: 'System announcement published!', type: 'success' });
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to publish announcement', type: 'error' });
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showToast({ message: 'Announcement removed', type: 'info' });
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to delete announcement', type: 'error' });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="py-20 text-center text-slate-400">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 mt-1">Please sign in as Bilal (Admin) to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-xl shadow-amber-950/15 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor platform health, active users, manage announcements, and moderate community content.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Users</span>
            <p className="text-2xl font-black text-white mt-1">{metrics.totalUsers}</p>
            <span className="text-[11px] text-blue-400 font-medium">
              {metrics.disabledUsers} disabled accounts
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Daily Active Users</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{metrics.dailyActiveUsers}</p>
            <span className="text-[11px] text-slate-400 font-medium">
              {metrics.weeklyActiveUsers} weekly active
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Salah Records</span>
            <p className="text-2xl font-black text-teal-400 mt-1">{metrics.totalPrayerRecords}</p>
            <span className="text-[11px] text-slate-400 font-medium">Across all members</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Quran Pages Read</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{metrics.totalQuranPages}</p>
            <span className="text-[11px] text-slate-400 font-medium">
              {metrics.totalCommunityPosts} community posts
            </span>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-white">Registered Users & Activity</h3>
            <p className="text-xs text-slate-400">Search members, monitor consistency, or toggle account access</p>
          </div>

          <form onSubmit={handleSearchUsers} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, @user..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Completed Salah</th>
                <th className="py-3 px-4">Quran Pgs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={u.name}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-400">{u.current_streak || 0}d</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{u.completed_prayers || 0}</td>
                  <td className="py-3 px-4 text-teal-400 font-bold">{u.quran_pages || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.is_disabled ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {u.is_disabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== user.id && (
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          u.is_disabled
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                        }`}
                        title={u.is_disabled ? 'Enable account' : 'Disable account'}
                      >
                        {u.is_disabled ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publish Announcement */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800 mb-4">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Broadcast Platform Announcement</h3>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Ramadan 1448 Habit Preparation & Group Khatams"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Content</label>
              <textarea
                rows={3}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your message to all members..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAnnouncement}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isSubmittingAnnouncement ? 'Publishing...' : 'Publish Announcement'}</span>
            </button>
          </form>
        </div>

        {/* Existing Announcements */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl">
          <h3 className="font-bold text-base text-white mb-4">Active System Announcements</h3>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-amber-300">{a.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{a.content}</p>
                  <span className="text-[10px] text-slate-500 block mt-2">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAnnouncement(a.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
