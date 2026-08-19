import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Trophy, 
  User as UserIcon,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuranModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuranModal
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/[0.09] px-2 pt-1.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-between relative max-w-md mx-auto">
        {/* 1. Home / Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {activeTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Namaz</span>
        </button>

        {/* 2. Leaderboard / Rankings */}
        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'leaderboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Trophy className="w-5 h-5" />
            {activeTab === 'leaderboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Rankings</span>
        </button>

        {/* 3. Center Floating "+" Quick-Log Button */}
        <div className="relative -top-3 px-1 shrink-0">
          <button
            type="button"
            onClick={onOpenQuranModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform active:scale-90 transition-transform border-2 border-slate-950"
            title="Log Quran Reading"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 4. Calendar & History */}
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'calendar' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <CalendarDays className="w-5 h-5" />
            {activeTab === 'calendar' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Calendar</span>
        </button>

        {/* 5. Profile & Settings */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'profile' || activeTab === 'settings' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            {isAuthenticated && user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={`w-5 h-5 rounded-full object-cover border ${
                  activeTab === 'profile' ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-slate-700'
                }`}
              />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
            {(activeTab === 'profile' || activeTab === 'settings') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};
