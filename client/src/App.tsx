import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { QuranModal } from './components/QuranModal';
import { TasbihModal } from './components/TasbihModal';
import { QiblaModal } from './components/QiblaModal';
import { InstallAppModal } from './components/InstallAppModal';
import { AuthModal } from './pages/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, isLoading, settings, refreshMe } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'forgot'>('login');
  const [isQuranModalOpen, setIsQuranModalOpen] = useState<boolean>(false);
  const [isTasbihOpen, setIsTasbihOpen] = useState<boolean>(false);
  const [isQiblaOpen, setIsQiblaOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [viewingLanding, setViewingLanding] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <span className="font-arabic text-2xl font-bold">م</span>
        </div>
        <p className="text-sm font-semibold text-slate-200">Majlis Al-Aman</p>
        <p className="text-xs text-slate-500 mt-1">Entering peaceful spiritual sanctuary...</p>
      </div>
    );
  }

  // If user is guest and chose landing or hasn't signed in yet
  if (!isAuthenticated && (viewingLanding || activeTab === 'landing')) {
    return (
      <>
        <Navbar
          onOpenAuth={() => {
            setAuthModalInitialMode('login');
            setIsAuthModalOpen(true);
          }}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setViewingLanding(false);
            setActiveTab(tab);
          }}
          onOpenTasbih={() => setIsTasbihOpen(true)}
          onOpenQibla={() => setIsQiblaOpen(true)}
          onOpenInstall={() => setIsInstallModalOpen(true)}
        />
        <LandingPage
          onGetStarted={() => {
            setAuthModalInitialMode('login');
            setIsAuthModalOpen(true);
          }}
          onExploreDemo={() => {
            setViewingLanding(false);
            setActiveTab('dashboard');
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalInitialMode}
        />
        <TasbihModal isOpen={isTasbihOpen} onClose={() => setIsTasbihOpen(false)} />
        <QiblaModal
          isOpen={isQiblaOpen}
          onClose={() => setIsQiblaOpen(false)}
          city={settings?.location_city}
          country={settings?.location_country}
        />
        <InstallAppModal
          isOpenManual={isInstallModalOpen}
          onCloseManual={() => setIsInstallModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen islamic-pattern-bg text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => {
          setAuthModalInitialMode('login');
          setIsAuthModalOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTasbih={() => setIsTasbihOpen(true)}
        onOpenQibla={() => setIsQiblaOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Main Layout: Sidebar + Main Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex pb-20 lg:pb-12 pt-6">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuranModal={() => setIsQuranModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0 lg:pl-6">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenTasbih={() => setIsTasbihOpen(true)}
              onOpenQibla={() => setIsQiblaOpen(true)}
            />
          )}
          {activeTab === 'calendar' && <CalendarPage />}
          {activeTab === 'statistics' && <StatisticsPage />}
          {activeTab === 'leaderboard' && <LeaderboardPage />}
          {activeTab === 'community' && <CommunityPage />}
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'settings' && <SettingsPage onOpenInstall={() => setIsInstallModalOpen(true)} />}
          {activeTab === 'admin' && <AdminPage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuranModal={() => setIsQuranModalOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
      />

      <QuranModal
        isOpen={isQuranModalOpen}
        onClose={() => setIsQuranModalOpen(false)}
        onSuccess={() => {
          refreshMe();
          showToast({ message: 'Quran reading logged! 📖', type: 'success' });
        }}
        defaultPages={settings?.daily_quran_goal || 10}
      />

      <TasbihModal isOpen={isTasbihOpen} onClose={() => setIsTasbihOpen(false)} />

      <QiblaModal
        isOpen={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        city={settings?.location_city}
        country={settings?.location_country}
      />

      {/* Automatic & Manual App Install Modal */}
      <InstallAppModal
        isOpenManual={isInstallModalOpen}
        onCloseManual={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
