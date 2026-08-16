import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Trophy, 
  User as UserIcon,
  Plus,
  Users
} from 'lucide-react';

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
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-4 py-2">
      <div className="flex items-center justify-around relative">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>

        {/* Calendar */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
            activeTab === 'calendar' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] mt-1">Calendar</span>
        </button>

        {/* Center Floating "+" Quick-Log Button */}
        <div className="relative -top-4">
          <button
            type="button"
            onClick={onOpenQuranModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-950/60 transform active:scale-90 transition-transform border-2 border-slate-950"
            title="Log Quran Reading"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Leaderboard / Community */}
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
            activeTab === 'leaderboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] mt-1">Rankings</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
            activeTab === 'profile' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};
