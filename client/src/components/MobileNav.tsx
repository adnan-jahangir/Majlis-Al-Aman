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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/[0.09] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-between relative max-w-md mx-auto">
        {/* Home / Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">Namaz</span>
        </button>

        {/* Community Feed */}
        <button
          type="button"
          onClick={() => setActiveTab('community')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'community' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">Ummah</span>
        </button>

        {/* Center Floating "+" Quick-Log Button */}
        <div className="relative -top-3.5 px-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenQuranModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform active:scale-90 transition-transform border-2 border-slate-950"
            title="Log Quran Reading"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Leaderboard / Rankings */}
        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'leaderboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">Rankings</span>
        </button>

        {/* Calendar & History */}
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'calendar' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">Calendar</span>
        </button>
      </div>
    </nav>
  );
};
