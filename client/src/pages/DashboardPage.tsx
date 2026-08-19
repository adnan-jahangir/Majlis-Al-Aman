import React, { useState, useEffect, useCallback } from 'react';
import { 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Plus,
  Compass,
  MapPin,
  Quote,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Copy,
  Shuffle,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { 
  PrayerName, 
  PrayerStatus, 
  TodayPrayersResponse, 
  QuranResponse, 
  CalculatedPrayerTimes 
} from '../types';
import { calculateLocalPrayerTimes } from '../services/prayerTimeService';
import { CircularProgress } from '../components/CircularProgress';
import { PrayerCard } from '../components/PrayerCard';
import { PrayerConfirmModal } from '../components/PrayerConfirmModal';
import { QuranModal } from '../components/QuranModal';
import { SPIRITUAL_COLLECTION, SpiritualWisdom } from '../data/spiritualWisdom';

const ARABIC_PRAYER_NAMES: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

const DEFAULT_PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Helper for local guest prayer tracking
const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const getGuestPrayers = (): TodayPrayersResponse => {
  const today = getTodayDateStr();
  try {
    const stored = localStorage.getItem(`majlis_guest_prayers_${today}`);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return {
    date: today,
    prayers: DEFAULT_PRAYER_NAMES.map(name => ({ name, status: 'pending' as PrayerStatus })),
    completedCount: 0,
    totalPrayers: 5,
    completionPercentage: 0
  };
};

const saveGuestPrayers = (data: TodayPrayersResponse) => {
  const today = getTodayDateStr();
  try {
    localStorage.setItem(`majlis_guest_prayers_${today}`, JSON.stringify(data));
  } catch (e) {}
};

export const DashboardPage: React.FC<{ onOpenTasbih?: () => void; onOpenQibla?: () => void }> = ({
  onOpenTasbih,
  onOpenQibla
}) => {
  const { user, settings, streak, refreshMe, isAuthenticated, updateUserSettings } = useAuth();
  const { showToast } = useToast();

  const [prayerData, setPrayerData] = useState<TodayPrayersResponse | null>(getGuestPrayers());
  const [quranData, setQuranData] = useState<QuranResponse | null>(null);
  const [calculatedTimes, setCalculatedTimes] = useState<CalculatedPrayerTimes | null>(null);
  const [countdownStr, setCountdownStr] = useState<string>('');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [activeLocation, setActiveLocation] = useState<{ city: string; lat: number; lng: number }>({
    city: settings?.location_city || 'Dhaka',
    lat: settings?.latitude || 23.8103,
    lng: settings?.longitude || 90.4125
  });

  // Dynamic Daily Ayah & Hadith State
  const initialWisdomIndex = new Date().getDate() % SPIRITUAL_COLLECTION.length;
  const [wisdomIndex, setWisdomIndex] = useState<number>(initialWisdomIndex);

  // Modals
  const [confirmModalPrayer, setConfirmModalPrayer] = useState<PrayerName | null>(null);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentWisdom: SpiritualWisdom = SPIRITUAL_COLLECTION[wisdomIndex] || SPIRITUAL_COLLECTION[0];

  const handleNextWisdom = () => {
    setWisdomIndex((prev) => (prev + 1) % SPIRITUAL_COLLECTION.length);
  };

  const handlePrevWisdom = () => {
    setWisdomIndex((prev) => (prev - 1 + SPIRITUAL_COLLECTION.length) % SPIRITUAL_COLLECTION.length);
  };

  const handleShuffleWisdom = () => {
    const nextIdx = Math.floor(Math.random() * SPIRITUAL_COLLECTION.length);
    setWisdomIndex(nextIdx);
  };

  const handleCopyWisdom = () => {
    const text = `${currentWisdom.arabic}\n\n${currentWisdom.bangla}\n${currentWisdom.english}\n— ${currentWisdom.reference}`;
    navigator.clipboard.writeText(text);
    showToast({ message: 'Ayah / Hadith copied to clipboard! 📋', type: 'success' });
  };

  // Calculate real-time dynamic astronomical prayer times based on exact GPS coordinates
  const fetchTimesForCoords = useCallback((lat: number, lng: number, method?: string, madhab?: string) => {
    try {
      const currentMethod = method || settings?.calc_method || 'Karachi';
      const currentMadhab = madhab || settings?.madhab || 'Hanafi';
      const times = calculateLocalPrayerTimes(lat, lng, currentMethod, currentMadhab, new Date());
      setCalculatedTimes(times);
    } catch (err) {
      console.error('Error calculating prayer times:', err);
    }
  }, [settings]);

  // GPS Auto-Detection with reverse geocoding
  const handleAutoDetectGPS = useCallback((showFeedback: boolean = true) => {
    if (!navigator.geolocation) {
      if (showFeedback) showToast({ message: 'Geolocation is not supported by your browser', type: 'error' });
      return;
    }

    setIsDetectingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));

        let detectedCity = 'My Live Location';
        let detectedCountry = '';

        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept-Language': 'en' }
          });
          const revData = await revRes.json();
          if (revData && revData.address) {
            detectedCity = revData.address.city || revData.address.town || revData.address.village || revData.address.state || 'Local City';
            detectedCountry = revData.address.country || '';
          }
        } catch (e) {
          // offline fallback
        }

        setActiveLocation({ city: detectedCity, lat, lng });

        // Immediately calculate prayer times for exact GPS coordinates
        fetchTimesForCoords(lat, lng);

        // Update settings in database if logged in
        if (isAuthenticated && updateUserSettings) {
          await updateUserSettings({
            latitude: lat,
            longitude: lng,
            location_city: detectedCity,
            location_country: detectedCountry || settings?.location_country
          });
        }

        setIsDetectingGps(false);
        if (showFeedback) {
          showToast({ message: `📍 GPS Live: ${detectedCity} (${lat}°, ${lng}°) — Prayer times updated!`, type: 'success' });
        }
      },
      (err) => {
        setIsDetectingGps(false);
        if (showFeedback) {
          showToast({ message: 'GPS permission denied or unavailable. Using saved location.', type: 'info' });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchTimesForCoords, isAuthenticated, updateUserSettings, settings, showToast]);

  // Initial load
  const loadDashboardData = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const [pRes, qRes] = await Promise.all([
          api.getTodayPrayers().catch(() => null),
          api.getQuranSummary().catch(() => null)
        ]);
        if (pRes) setPrayerData(pRes);
        if (qRes) setQuranData(qRes);
      } else {
        setPrayerData(getGuestPrayers());
      }

      const lat = settings?.latitude || activeLocation.lat;
      const lng = settings?.longitude || activeLocation.lng;
      setActiveLocation({
        city: settings?.location_city || activeLocation.city,
        lat,
        lng
      });
      fetchTimesForCoords(lat, lng);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings, isAuthenticated, activeLocation.lat, activeLocation.lng, activeLocation.city, fetchTimesForCoords]);

  useEffect(() => {
    loadDashboardData();
    handleAutoDetectGPS(false);
  }, [isAuthenticated]);

  // Real-time live 1-second interval clock & countdown to next prayer
  useEffect(() => {
    const lat = settings?.latitude || activeLocation.lat;
    const lng = settings?.longitude || activeLocation.lng;
    const currentMethod = settings?.calc_method || 'Karachi';
    const currentMadhab = settings?.madhab || 'Hanafi';

    const tick = () => {
      const times = calculateLocalPrayerTimes(lat, lng, currentMethod, currentMadhab, new Date());
      setCalculatedTimes(times);

      if (times.nextPrayer) {
        const diff = times.nextPrayer.remainingMs;
        if (diff <= 0) {
          setCountdownStr('Now');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          if (hours > 0) {
            setCountdownStr(`${hours}h ${mins}m ${secs}s`);
          } else if (mins > 0) {
            setCountdownStr(`${mins}m ${secs}s`);
          } else {
            setCountdownStr(`${secs}s`);
          }
        }
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [settings?.latitude, settings?.longitude, settings?.calc_method, settings?.madhab, activeLocation.lat, activeLocation.lng]);

  // Handle Quick Toggle (Works for Guest & Signed-in Users Instantly!)
  const handleQuickToggle = async (prayerName: PrayerName, e: React.MouseEvent) => {
    e.stopPropagation();

    const currentPrayers = prayerData?.prayers || DEFAULT_PRAYER_NAMES.map(n => ({ name: n, status: 'pending' as PrayerStatus }));
    const currentItem = currentPrayers.find(p => p.name === prayerName);
    const newStatus: PrayerStatus = currentItem?.status === 'completed' ? 'pending' : 'completed';

    // Instant Optimistic UI Update
    const updatedPrayers = currentPrayers.map(p => p.name === prayerName ? { ...p, status: newStatus } : p);
    const completedCount = updatedPrayers.filter(p => p.status === 'completed').length;
    const completedAllToday = completedCount === 5;

    const newPrayerData: TodayPrayersResponse = {
      date: prayerData?.date || getTodayDateStr(),
      prayers: updatedPrayers,
      completedCount,
      totalPrayers: 5,
      completionPercentage: Math.round((completedCount / 5) * 100)
    };

    setPrayerData(newPrayerData);

    if (newStatus === 'completed') {
      if (completedAllToday) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast({
          message: `🎉 MashAllah! All 5 daily prayers completed today!`,
          type: 'success'
        });
      } else {
        showToast({
          message: `${prayerName} marked as completed ✓`,
          type: 'success'
        });
      }
    } else {
      showToast({
        message: `${prayerName} marked as pending`,
        type: 'info'
      });
    }

    if (isAuthenticated) {
      try {
        const res = await api.togglePrayer({ prayerName, status: newStatus });
        setPrayerData({
          date: res.date,
          prayers: res.prayers,
          completedCount: res.completedCount,
          totalPrayers: 5,
          completionPercentage: res.completionPercentage
        });
        await refreshMe();
      } catch (err: any) {
        console.error('Cloud sync error:', err);
      }
    } else {
      saveGuestPrayers(newPrayerData);
    }
  };

  // Handle Confirmation Modal submit (Works for Guest & Signed-in Users!)
  const handleConfirmModalStatus = async (prayerName: PrayerName, status: PrayerStatus, notes?: string) => {
    setConfirmModalPrayer(null);

    const currentPrayers = prayerData?.prayers || DEFAULT_PRAYER_NAMES.map(n => ({ name: n, status: 'pending' as PrayerStatus }));
    const updatedPrayers = currentPrayers.map(p => p.name === prayerName ? { ...p, status, notes } : p);
    const completedCount = updatedPrayers.filter(p => p.status === 'completed').length;
    const completedAllToday = completedCount === 5;

    const newPrayerData: TodayPrayersResponse = {
      date: prayerData?.date || getTodayDateStr(),
      prayers: updatedPrayers,
      completedCount,
      totalPrayers: 5,
      completionPercentage: Math.round((completedCount / 5) * 100)
    };

    setPrayerData(newPrayerData);

    if (status === 'completed' && completedAllToday) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    showToast({
      message: `${prayerName} status updated to ${status} ✓`,
      type: status === 'completed' ? 'success' : 'info'
    });

    if (isAuthenticated) {
      try {
        const res = await api.togglePrayer({ prayerName, status, notes });
        setPrayerData({
          date: res.date,
          prayers: res.prayers,
          completedCount: res.completedCount,
          totalPrayers: 5,
          completionPercentage: res.completionPercentage
        });
        await refreshMe();
      } catch (err: any) {
        console.error('Cloud sync error:', err);
      }
    } else {
      saveGuestPrayers(newPrayerData);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const completedPrayersCount = prayerData?.completedCount ?? 0;
  const todayQuranPages = quranData?.todayPages ?? 0;
  const todayQuranDuration = quranData?.todayDuration ?? 0;
  const quranGoal = settings?.daily_quran_goal || 10;
  const quranPercentage = quranData?.goalPercentage ?? (todayQuranPages > 0 ? Math.min(100, Math.round((todayQuranPages / quranGoal) * 100)) : 0);
  const prayerPercentage = prayerData?.completionPercentage ?? (completedPrayersCount > 0 ? Math.round((completedPrayersCount / 5) * 100) : 0);

  const overallScore = Math.round(
    (prayerPercentage * 0.7) +
    (quranPercentage * 0.3)
  );

  // Always construct 5 prayer items
  const displayPrayers = DEFAULT_PRAYER_NAMES.map(name => {
    const found = prayerData?.prayers.find(p => p.name === name);
    return {
      name,
      status: (found ? found.status : 'pending') as PrayerStatus,
      notes: found ? found.notes : null
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Sacred Bismillah Calligraphic Header Bar */}
      <div className="text-center pt-2 pb-1 select-none">
        <p className="font-calligraphy text-2xl sm:text-3xl text-amber-300/90 tracking-wider bismillah-glow">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-[11px] font-cinzel text-slate-400/80 tracking-widest uppercase mt-1">
          In the Name of Allah, the Most Gracious, the Most Merciful
        </p>
      </div>

      {/* Top Greeting & Next Prayer Spiritual Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 spiritual-card border-white/[0.09]">
        {/* Soft background ambient lights */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{todayStr}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300/90 font-bold">1448 AH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Assalamu Alaikum, {user?.name?.split(' ')[0] || 'Friend'} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
              May this day bring tranquility, barakah, and steadfastness in your worship.
            </p>

            {/* Quick Action Tools Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              {/* GPS Live Sync Button */}
              <button
                type="button"
                onClick={() => handleAutoDetectGPS(true)}
                disabled={isDetectingGps}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm"
                title="Detect live GPS coordinates and recalculate Namaz times"
              >
                <MapPin className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : 'text-emerald-400'}`} />
                <span>{isDetectingGps ? 'Locating...' : `GPS: ${activeLocation.city}`}</span>
              </button>

              <button
                type="button"
                onClick={onOpenTasbih}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Digital Tasbih</span>
              </button>

              <button
                type="button"
                onClick={onOpenQibla}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Qibla Compass</span>
              </button>
            </div>
          </div>

          {/* Next Prayer Countdown Illuminated Card */}
          {calculatedTimes?.nextPrayer && (
            <div className="flex items-center space-x-4 bg-slate-950/70 border border-amber-500/30 px-6 py-4 rounded-3xl shrink-0 backdrop-blur-xl shadow-2xl shadow-amber-950/20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-amber-400/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 font-cinzel">Upcoming Salah</span>
                <div className="flex items-baseline space-x-2">
                  <h4 className="text-lg font-bold text-white tracking-tight">{calculatedTimes.nextPrayer.name}</h4>
                  <span className="text-xs text-amber-300 font-semibold">{calculatedTimes.nextPrayer.time}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {countdownStr === 'Now' ? (
                    <span className="text-emerald-400 font-bold tracking-wide">Time has entered ✓</span>
                  ) : (
                    <>in <span className="text-emerald-400 font-bold tracking-wide">{countdownStr || 'calculating...'}</span></>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Daily Quranic Ayah & Hadith Card (With Interactive Switcher) */}
      <div className="p-6 sm:p-7 rounded-3xl spiritual-gold-card relative overflow-hidden transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5 shadow-inner">
              <Quote className="w-5 h-5" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-cinzel">
                  {currentWisdom.type === 'ayah' ? '📖 Noble Quran Ayah' : '📜 Authentic Hadith'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {currentWisdom.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {currentWisdom.reference}
                </span>
              </div>

              {/* Arabic Text */}
              <p className="font-calligraphy text-2xl sm:text-3xl text-amber-200/95 font-bold leading-relaxed pt-1.5 bismillah-glow select-text">
                {currentWisdom.arabic}
              </p>

              {/* Bangla Translation */}
              <p className="text-sm font-semibold text-emerald-300/95 leading-relaxed pt-1 select-text">
                {currentWisdom.bangla}
              </p>

              {/* English Translation */}
              <p className="text-xs text-slate-300/90 italic leading-relaxed pt-0.5 select-text">
                "{currentWisdom.english}"
              </p>
            </div>
          </div>

          {/* Interactive wisdom switcher controls */}
          <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevWisdom}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
                title="Previous Ayah/Hadith"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShuffleWisdom}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
                title="Randomize Ayah/Hadith"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextWisdom}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
                title="Next Ayah/Hadith"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyWisdom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold transition-colors"
              title="Copy Ayah/Hadith text"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Daily Spiritual Collection: {wisdomIndex + 1} of {SPIRITUAL_COLLECTION.length}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevWisdom}
              className="hover:text-amber-300 transition-colors flex items-center gap-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleNextWisdom}
              className="hover:text-amber-300 transition-colors flex items-center gap-0.5"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Progress Card + Quran Card + Streak Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Today's Progress Ring & Checklist */}
        <div className="p-6 rounded-3xl spiritual-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-cinzel">Salah Worship</span>
                <h3 className="text-lg font-bold text-white tracking-tight">Today's Prayers</h3>
              </div>
              <button
                onClick={loadDashboardData}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Progress Ring with Glowing Aura */}
            <div className="py-6 flex justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <CircularProgress
                completed={completedPrayersCount}
                total={5}
                size={170}
                strokeWidth={14}
              />
            </div>

            {/* Mini prayer checklist badges */}
            <div className="grid grid-cols-5 gap-1.5 pt-2">
              {DEFAULT_PRAYER_NAMES.map((pName) => {
                const isDone = displayPrayers.find(p => p.name === pName)?.status === 'completed';
                return (
                  <div
                    key={pName}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-semibold border transition-all ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                    }`}
                  >
                    <p className="text-[10px] font-medium">{pName}</p>
                    <span className="text-xs font-bold">{isDone ? '✓' : '○'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Location: <strong className="text-emerald-300 font-semibold">{activeLocation.city}</strong></span>
            <span>Method: <strong className="text-slate-200">{settings?.calc_method || 'Karachi'}</strong></span>
          </div>
        </div>

        {/* Card 2: Dedicated Quran Progress Card */}
        <div className="p-5 sm:p-6 rounded-3xl spiritual-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-cinzel block truncate">Noble Quran</span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">Daily Tilawah</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQuranModalOpen(true)}
                className="shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-950/40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Reading</span>
              </button>
            </div>

            {/* Reading Pages Progress */}
            <div className="my-5">
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {todayQuranPages} Pages
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Today</span>
                </div>
                <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                  Goal: {quranGoal} pgs
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${quranPercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium">
                <span>{quranPercentage}% of daily goal</span>
                <span>{todayQuranDuration} mins spent</span>
              </div>
            </div>

            {/* Recent Reading Snippet */}
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs space-y-1">
              <p className="font-semibold text-slate-200">
                Total Khatam Progress: <strong className="text-teal-400">{quranData?.totalStats.khatamPercentage ?? '0.0'}%</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Total Read: {quranData?.totalStats.totalPages ?? 0} pages • {quranData?.totalStats.completedKhatams ?? 0} Khatams
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
            <span className="text-xs text-slate-400/90 italic">
              “Read the Quran, for it will intercede on the Day of Resurrection.”
            </span>
          </div>
        </div>

        {/* Card 3: Dedicated Streak & Steadfastness Summary */}
        <div className="p-6 rounded-3xl spiritual-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-4 h-4 animate-flame" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-cinzel">Istiqaamah</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">Steadfastness</h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Active 🔥
              </span>
            </div>

            {/* Big Streak Flame Display */}
            <div className="my-5 text-center p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 via-transparent to-transparent border border-amber-500/20">
              <div className="flex items-center justify-center space-x-2">
                <Flame className="w-8 h-8 text-amber-400 animate-flame" />
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {streak?.current_streak ?? 0} Day Streak
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                “The most beloved of deeds to Allah are those done regularly.”
              </p>
            </div>

            {/* Streak Key Numbers */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Current</span>
                <p className="text-base font-bold text-amber-400">{streak?.current_streak ?? 0}d</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Longest</span>
                <p className="text-base font-bold text-slate-200">{streak?.longest_streak ?? 0}d</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Active</span>
                <p className="text-base font-bold text-emerald-400">{streak?.total_active_days ?? 0}d</p>
              </div>
            </div>
          </div>

          {/* Daily Activity Summary */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">Daily Balance Score:</span>
              <span className="font-bold text-emerald-400">{overallScore}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Five Daily Prayer Cards Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-cinzel">Astronomical Sun Times</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <MapPin className="w-3 h-3 text-emerald-400" /> {activeLocation.city} ({activeLocation.lat}°, {activeLocation.lng}°)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Five Daily Prayers & Schedule</h2>
          </div>

          <button
            type="button"
            onClick={() => handleAutoDetectGPS(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Re-Sync Live GPS</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {displayPrayers.map((prayer) => {
            const time = calculatedTimes?.times[prayer.name] || '';
            const isNext = !!calculatedTimes?.nextPrayer?.name.toLowerCase().startsWith(prayer.name.toLowerCase());

            return (
              <PrayerCard
                key={prayer.name}
                name={prayer.name}
                arabicName={ARABIC_PRAYER_NAMES[prayer.name]}
                time={time}
                status={prayer.status}
                isNext={isNext}
                onOpenConfirm={(name) => setConfirmModalPrayer(name)}
                onQuickToggle={handleQuickToggle}
              />
            );
          })}
        </div>
      </div>

      {/* Confirmation & Quran Modals */}
      <PrayerConfirmModal
        isOpen={!!confirmModalPrayer}
        prayerName={confirmModalPrayer}
        currentStatus={
          confirmModalPrayer
            ? displayPrayers.find(p => p.name === confirmModalPrayer)?.status || 'pending'
            : 'pending'
        }
        onClose={() => setConfirmModalPrayer(null)}
        onConfirm={handleConfirmModalStatus}
      />

      <QuranModal
        isOpen={isQuranModalOpen}
        onClose={() => setIsQuranModalOpen(false)}
        onSuccess={() => {
          loadDashboardData();
          refreshMe();
          showToast({ message: 'Quran reading session logged! 📖', type: 'success' });
        }}
        defaultPages={settings?.daily_quran_goal || 10}
      />
    </div>
  );
};
