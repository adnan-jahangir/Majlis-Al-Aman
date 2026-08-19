import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon,
  Flame,
  Settings,
  Sun
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTasbih: () => void;
  onOpenQibla: () => void;
  onOpenAdhkar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  setActiveTab,
  onOpenTasbih,
  onOpenQibla,
  onOpenAdhkar
}) => {
  const { user, isAuthenticated, streak, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.07] bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="Majlis Al-Aman Logo" className="w-7 h-7 object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Majlis Al-Aman
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
                مَجْلِسُ الأَمَان
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Islamic Prayer & Quran Habit Tracker</p>
          </div>
        </div>

        {/* Center Date & Today Greeting */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentDate}</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-semibold">1448 AH</span>
        </div>

        {/* Right Action Icons & User Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Desktop-only Quick Tool Triggers (Tasbih, Qibla, Adhkar) */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Tasbih Counter Trigger */}
            <button
              type="button"
              onClick={onOpenTasbih}
              className="p-2 rounded-xl text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 transition-colors flex items-center space-x-1 text-xs font-medium"
              title="Digital Tasbih & Dhikr"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Tasbih</span>
            </button>

            {/* Qibla Compass Trigger */}
            <button
              type="button"
              onClick={onOpenQibla}
              className="p-2 rounded-xl text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 transition-colors flex items-center space-x-1 text-xs font-medium"
              title="Qibla Compass"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Qibla</span>
            </button>

            {/* Daily Adhkar Trigger */}
            {onOpenAdhkar && (
              <button
                type="button"
                onClick={onOpenAdhkar}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold transition-all shadow-sm"
                title="Daily Morning & Evening Adhkar"
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Adhkar</span>
              </button>
            )}
          </div>

          {/* Streak Quick Pill (if authenticated) */}
          {isAuthenticated && streak && (
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-flame" />
              <span>{streak.current_streak}d</span>
            </div>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 pl-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
                />
                <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate hidden md:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400">@{user.username}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile & Heatmap</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-amber-300 hover:bg-slate-800 transition-colors text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
