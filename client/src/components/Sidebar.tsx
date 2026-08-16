import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Trophy, 
  Users, 
  User as UserIcon, 
  Settings, 
  ShieldCheck,
  BookOpenCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuranModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuranModal
}) => {
  const { user } = useAuth();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar & History', icon: CalendarDays },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'community', label: 'Community Feed', icon: Users },
    { id: 'profile', label: 'Profile & Badges', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    NAV_ITEMS.push({ id: 'admin', label: 'Admin Portal', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block p-4">
      <div className="sticky top-20 flex flex-col justify-between h-[calc(100vh-6rem)]">
        {/* Main Nav Items */}
        <div className="space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAdmin = item.id === 'admin';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left relative group ${
                  isActive
                    ? isAdmin
                      ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? isAdmin ? 'text-amber-400' : 'text-emerald-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>

                {isActive && (
                  <span
                    className={`absolute right-2 w-1.5 h-1.5 rounded-full ${
                      isAdmin ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Action Button & Bottom Info Card */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onOpenQuranModal}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all transform active:scale-98"
          >
            <BookOpenCheck className="w-4 h-4 text-slate-950" />
            <span>+ Log Quran Reading</span>
          </button>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>🌿 Daily Hadith</span>
            </p>
            <p className="text-slate-400 italic text-[11px] mt-1 line-clamp-3">
              “The most beloved deeds to Allah are those that are most consistent, even if they are small.”
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">— Sahih Bukhari</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
