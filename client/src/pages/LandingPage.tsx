import React from 'react';
import { 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Lock,
  Sunrise,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';
import { CircularProgress } from '../components/CircularProgress';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo
}) => {
  return (
    <div className="min-h-screen islamic-pattern-bg text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Subtle glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modern, Peaceful & Privacy-First Islamic Habit Tracker</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Build Consistency.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Strengthen Your Iman.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Track your daily prayers, Quran reading, and spiritual habits in one peaceful space designed for lifelong consistency.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all"
            >
              <span>Start Tracking Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all hover:border-slate-600"
            >
              <span>⚡ Explore Live Demo</span>
            </button>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-slate-800/40 to-transparent shadow-2xl">
              <div className="rounded-[22px] bg-slate-950/90 p-6 sm:p-8 border border-white/[0.07] backdrop-blur-2xl">
                {/* Mock header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-emerald-400">Assalamu Alaikum, Adnan 👋</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Today’s Spiritual Journey</h3>
                    <p className="text-xs text-slate-400">“Small consistent actions lead to meaningful change.”</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      <Flame className="w-4 h-4 text-amber-400 animate-flame" />
                      <span>14 Day Streak</span>
                    </div>
                    <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      Sunday, Aug 16
                    </div>
                  </div>
                </div>

                {/* Mock Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* Progress Indicator */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <CircularProgress completed={4} total={5} size={150} />
                  </div>

                  {/* 5 Prayers Mini List */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Daily Prayers</p>
                    {[
                      { name: 'Fajr', time: '05:12 AM', done: true, icon: Sunrise },
                      { name: 'Dhuhr', time: '01:05 PM', done: true, icon: Sun },
                      { name: 'Asr', time: '04:48 PM', done: true, icon: Sun },
                      { name: 'Maghrib', time: '07:54 PM', done: true, icon: Sunset },
                      { name: 'Isha', time: '09:22 PM', done: false, icon: Moon }
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <div
                          key={p.name}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border ${
                            p.done
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                            <span>{p.name}</span>
                          </div>
                          <span className="text-[11px] font-semibold">{p.done ? '✓ Done' : p.time}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quran Tracker & Habit Summary */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quran Reading</span>
                        <span className="text-xs text-emerald-400 font-bold">12 / 15 Pages</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[80%]" />
                      </div>
                      <p className="text-xs text-slate-400">Surah 18. Al-Kahf (25 mins)</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Overall Day Score:</span>
                        <span className="text-emerald-400 font-bold">85%</span>
                      </div>
                      <span className="text-[11px] text-slate-500 italic block">
                        “Keep going! You are building consistency.”
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Majlis Al-Aman Section */}
      <section className="py-20 border-t border-white/[0.06] bg-slate-950/40 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Purpose-Built for Muslims</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Why Majlis Al-Aman?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base mb-12">
            Engineered to replace scattered notes and generic apps with a serene, unified sanctuary for spiritual accountability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Track 5 Daily Prayers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log Fajr, Dhuhr, Asr, Maghrib, and Isha with astronomical prayer times calculated for your exact coordinates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-teal-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Track Quran Reading</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Record pages, Surahs, and reading time. Monitor Khatam progress and cultivate a daily habit with the Word of Allah.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-amber-500/20">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Build Daily Streaks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stay motivated with respectful streak tracking and unlock spiritual milestones without superficial gamification.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-indigo-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">See Your Progress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore weekly completion charts, Fajr consistency rates, monthly trends, and a 365-day annual habit heatmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-white/[0.06] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Simple & Effortless</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-12">
            How Majlis Al-Aman Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Create Your Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign up in seconds and set your local calculation method and city.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">Track Prayers & Quran</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mark Salah as completed in 1 click and log daily Quran reading sessions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Build Lifelong Consistency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review your monthly calendar history, stats, and stay inspired every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Privacy Spotlight */}
      <section className="py-20 border-t border-white/[0.06] bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
                <Trophy className="w-3.5 h-3.5" />
                <span>Consistency, Not Competition</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Uplifting Community & Full Privacy Control
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Connect with believers who share your dedication. Encourage each other with heartfelt du’as and celebrate consistency streaks.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Granular Privacy:</strong> Hide your prayer stats, Quran records, or profile from the leaderboard at any time.</span>
                </div>
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Respectful Environment:</strong> Clean, spam-free encouragement feed with positive reactions.</span>
                </div>
              </div>
            </div>

            {/* Leaderboard Mock Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Consistency Leaderboard</span>
                <span className="text-[11px] font-semibold text-emerald-400">This Week</span>
              </div>
              {[
                { rank: '🥇', name: 'Layla Noor', consistency: '98%', streak: '28d' },
                { rank: '🥈', name: 'Sarah Al-Hassan', consistency: '95%', streak: '18d' },
                { rank: '🥉', name: 'Adnan Tariq', consistency: '92%', streak: '14d' }
              ].map((u) => (
                <div key={u.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{u.rank}</span>
                    <span className="font-semibold text-slate-100">{u.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-emerald-400 font-bold">{u.consistency}</span>
                    <span className="text-amber-400 font-semibold">🔥 {u.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 border-t border-white/[0.06] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Start building better habits today.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Join thousands of Muslims who have transformed their spiritual discipline with Majlis Al-Aman.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/[0.06] bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 Majlis Al-Aman (مَجْلِسُ الأَمَان). Dedicated to personal consistency and spiritual peace.</p>
      </footer>
    </div>
  );
};
