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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/[0.09] px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-between relative max-w-md mx-auto">
        {/* Home / Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Namaz</span>
        </button>

        {/* Community Feed */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'community' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Community</span>
        </button>

        {/* Center Floating "+" Quick-Log Button */}
        <div className="relative -top-3 px-1">
          <button
            type="button"
            onClick={onOpenQuranModal}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-950/80 transform active:scale-90 transition-transform border-2 border-slate-950"
            title="Log Quran Reading"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </button>
        </div>

        {/* Leaderboard / Rankings */}
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'leaderboard' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Rankings</span>
        </button>

        {/* Calendar & History */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'calendar' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-1 tracking-tight">Calendar</span>
        </button>
      </div>
    </div>
  );
};
