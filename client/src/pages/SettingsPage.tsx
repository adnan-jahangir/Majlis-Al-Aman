import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Bell, 
  Lock, 
  BookOpen, 
  Save, 
  Compass, 
  Search,
  Sparkles,
  CheckCircle2,
  Globe,
  Download,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserSettings } from '../types';

interface SettingsPageProps {
  onOpenInstall?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenInstall }) => {
  const { settings, updateUserSettings } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<UserSettings>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    const isIosDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        showToast({ message: 'App installed successfully! 📱', type: 'success' });
      }
      setDeferredPrompt(null);
    } else if (onOpenInstall) {
      onOpenInstall();
    } else if (isIOS) {
      showToast({ message: "On iOS, tap Share 📤 then 'Add to Home Screen' ➕", type: 'info' });
    } else {
      showToast({ message: "Click your browser menu (⋮) and select 'Install app' or 'Add to Home screen'", type: 'info' });
    }
  };

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserSettings(formData);
      showToast({ message: 'Location & Settings saved successfully! 🌿', type: 'success' });
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to save settings', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick City Presets for 1-click setting
  const QUICK_CITIES = [
    { city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, flag: '🇧🇩', calc: 'Karachi' },
    { city: 'Chittagong', country: 'Bangladesh', lat: 22.3569, lng: 91.7832, flag: '🇧🇩', calc: 'Karachi' },
    { city: 'Sylhet', country: 'Bangladesh', lat: 24.8949, lng: 91.8687, flag: '🇧🇩', calc: 'Karachi' },
    { city: 'Mecca', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, flag: '🇸🇦', calc: 'Makkah' },
    { city: 'Medina', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692, flag: '🇸🇦', calc: 'Makkah' },
    { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, flag: '🇬🇧', calc: 'MWL' },
    { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, flag: '🇺🇸', calc: 'ISNA' },
    { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, flag: '🇦🇪', calc: 'Dubai' },
    { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, flag: '🇲🇾', calc: 'MWL' }
  ];

  const handleSelectPresetCity = (item: typeof QUICK_CITIES[0]) => {
    setFormData(prev => ({
      ...prev,
      location_city: item.city,
      location_country: item.country,
      latitude: item.lat,
      longitude: item.lng,
      calc_method: item.calc || prev.calc_method
    }));
    showToast({ message: `Location set to ${item.city}, ${item.country} (${item.lat}, ${item.lng})`, type: 'success' });
  };

  // Search City Geocoding API
  const handleCitySearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = citySearchQuery.trim() || formData.location_city?.trim();
    if (!q) {
      showToast({ message: 'Please enter a city name to search', type: 'info' });
      return;
    }

    setIsSearchingCity(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await response.json();

      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(parseFloat(place.lat).toFixed(4));
        const lng = parseFloat(parseFloat(place.lon).toFixed(4));
        
        // Extract display city and country
        const nameParts = place.display_name.split(', ');
        const cityName = nameParts[0] || q;
        const countryName = nameParts[nameParts.length - 1] || '';

        setFormData(prev => ({
          ...prev,
          location_city: cityName,
          location_country: countryName,
          latitude: lat,
          longitude: lng
        }));

        showToast({ message: `Found ${cityName}, ${countryName} (${lat}, ${lng}) ✓`, type: 'success' });
      } else {
        showToast({ message: `Could not find coordinates for "${q}". Please check city spelling or enter manually.`, type: 'error' });
      }
    } catch (err) {
      showToast({ message: 'Geocoding service unavailable. You can enter latitude and longitude manually below.', type: 'error' });
    } finally {
      setIsSearchingCity(false);
    }
  };

  // GPS Auto Detection + Reverse Geocoding
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast({ message: 'GPS / Geolocation is not supported by your browser', type: 'error' });
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));

        let cityName = 'Current Location';
        let countryName = '';

        // Reverse geocoding for human-readable city name
        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept-Language': 'en' }
          });
          const revData = await revRes.json();
          if (revData && revData.address) {
            cityName = revData.address.city || revData.address.town || revData.address.village || revData.address.state || 'My Location';
            countryName = revData.address.country || '';
          }
        } catch (e) {
          // fallback to coordinates if offline
        }

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location_city: cityName,
          location_country: countryName || prev.location_country
        }));

        setIsDetectingLocation(false);
        showToast({ message: `GPS Detected: ${cityName} (${lat}, ${lng}) ✓`, type: 'success' });
      },
      (err) => {
        setIsDetectingLocation(false);
        let errorMsg = 'GPS location permission was denied or timed out.';
        if (err.code === 1) {
          errorMsg = 'Location permission denied in browser. Please allow location access or select your city from the quick presets below.';
        } else if (err.code === 2) {
          errorMsg = 'Position unavailable. Please search your city name or pick from quick presets.';
        }
        showToast({ message: errorMsg, type: 'error' });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const CALC_METHODS = [
    { id: 'Karachi', name: 'University of Islamic Sciences, Karachi (Bangladesh, Pakistan, India)' },
    { id: 'ISNA', name: 'ISNA (Islamic Society of North America)' },
    { id: 'MWL', name: 'Muslim World League (MWL - Europe, Far East)' },
    { id: 'Makkah', name: 'Umm Al-Qura University, Makkah' },
    { id: 'Egypt', name: 'Egyptian General Authority of Survey' },
    { id: 'Dubai', name: 'Gulf / Dubai Islamic Affairs' },
    { id: 'Singapore', name: 'MUIS (Singapore)' },
    { id: 'Turkey', name: 'Diyanet İşleri Başkanlığı (Turkey)' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Preferences & Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Location & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Set your city, calculation method, notification reminders, and privacy controls.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Prayer Time Calculations & Location */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Location & Geolocation</h3>
                <p className="text-xs text-slate-400">Prayer times are astronomically calculated for your precise position</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingLocation}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-md"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{isDetectingLocation ? 'Detecting GPS...' : '📍 Auto Detect GPS'}</span>
            </button>
          </div>

          {/* Quick City Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              ⚡ Quick City Presets (1-Click Selection)
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_CITIES.map((item) => {
                const isSelected = formData.location_city?.toLowerCase() === item.city.toLowerCase();

                return (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => handleSelectPresetCity(item)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/40 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.city}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* City Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Search Any City Name (Auto-Lookup Coordinates)
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="e.g. Dhaka, Chittagong, Sylhet, London, New York..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCitySearch()}
                disabled={isSearchingCity}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {isSearchingCity ? 'Searching...' : 'Search Location'}
              </button>
            </div>
          </div>

          {/* Active Coordinates & Manual Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Current City Name
              </label>
              <input
                type="text"
                value={formData.location_city || ''}
                onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                placeholder="e.g. Dhaka"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Country
              </label>
              <input
                type="text"
                value={formData.location_country || ''}
                onChange={(e) => setFormData({ ...formData, location_country: e.target.value })}
                placeholder="e.g. Bangladesh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Latitude Coordinates
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude ?? 23.8103}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Longitude Coordinates
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude ?? 90.4125}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Calculation Authority
              </label>
              <select
                value={formData.calc_method || 'Karachi'}
                onChange={(e) => setFormData({ ...formData, calc_method: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {CALC_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Asr Juristic Method (Madhab)
              </label>
              <select
                value={formData.madhab || 'Standard'}
                onChange={(e) => setFormData({ ...formData, madhab: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Standard">Standard / Shafi'i, Maliki, Hanbali (Shadow = 1x)</option>
                <option value="Hanafi">Hanafi (Shadow = 2x)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Daily Quran Goals */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Daily Quran Habit Goal</h3>
              <p className="text-xs text-slate-400">Target pages to read each day</p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Pages Per Day
            </label>
            <input
              type="number"
              min="1"
              max="604"
              value={formData.daily_quran_goal ?? 10}
              onChange={(e) => setFormData({ ...formData, daily_quran_goal: parseInt(e.target.value, 10) || 10 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Section 3: Privacy & Visibility Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Privacy Controls</h3>
              <p className="text-xs text-slate-400">Spiritual deeds are personal. Control who can view your stats.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'appear_on_leaderboard', label: 'Appear on Consistency Leaderboard', desc: 'Allow your name and streak to be included on the motivation board' },
              { key: 'show_prayer_stats', label: 'Show Prayer Consistency %', desc: 'Display your prayer completion rate on public profile and leaderboard' },
              { key: 'show_quran_stats', label: 'Show Quran Reading Stats', desc: 'Display your total Quran pages and active reading days' },
              { key: 'show_community_activity', label: 'Share Milestones to Community Feed', desc: 'Allow major streak and Quran milestones to be shared with friends' }
            ].map((item) => {
              const val = (formData as any)[item.key] === 1;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.label}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, [item.key]: val ? 0 : 1 })}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      val ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        val ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Real-Time Notifications & Tracker Reminders */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Daily Tracker & Prayer Reminders</h3>
                <p className="text-xs text-slate-400">Receive free real-time browser push alerts & daily fill-up email reminders</p>
              </div>
            </div>

            {/* Test Notification Button */}
            <button
              type="button"
              onClick={async () => {
                const { notificationService } = await import('../services/notificationService');
                const hasPermission = await notificationService.requestPermission();
                if (hasPermission) {
                  notificationService.sendTestNotification(formData.location_city || 'Brother/Sister');
                  showToast({ message: 'Push notification triggered on your screen! 🔔', type: 'success' });
                } else {
                  showToast({ message: 'Browser notification permission required. Please allow notifications.', type: 'info' });
                }

                // Also trigger backend test
                try {
                  const { api } = await import('../services/api');
                  await api.sendTestReminder();
                } catch (e) {}
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm self-start sm:self-center"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>🔔 Test Notification</span>
            </button>
          </div>

          {/* Browser Permission Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Browser Push Notifications (Mobile & Desktop)
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable instant screen alerts when prayer times arrive and when it's time to log worship.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                const { notificationService } = await import('../services/notificationService');
                const granted = await notificationService.requestPermission();
                if (granted) {
                  showToast({ message: 'Browser notifications enabled successfully! 🌿', type: 'success' });
                } else {
                  showToast({ message: 'Permission was not granted in browser settings.', type: 'error' });
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' 
                ? '✓ Notifications Enabled' 
                : '🔔 Enable Push Notifications'}
            </button>
          </div>

          {/* Daily Tracker Reminder Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Daily Tracker Fill-Up Alert
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, email_reminder: (formData.email_reminder ?? 1) === 1 ? 0 : 1 })}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    (formData.email_reminder ?? 1) === 1 ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      (formData.email_reminder ?? 1) === 1 ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Receive an automatic reminder if any of today's 5 prayers or Quran habits are incomplete.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                Daily Reminder Time
              </label>
              <input
                type="time"
                value={formData.reminder_time || '22:00'}
                onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Default: 22:00 (10:00 PM) every night.
              </p>
            </div>
          </div>

          {/* Individual Prayer Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { key: 'fajr_reminder', label: 'Fajr Prayer Notification' },
              { key: 'dhuhr_reminder', label: 'Dhuhr Prayer Notification' },
              { key: 'asr_reminder', label: 'Asr Prayer Notification' },
              { key: 'maghrib_reminder', label: 'Maghrib Prayer Notification' },
              { key: 'isha_reminder', label: 'Isha Prayer Notification' },
              { key: 'quran_reminder', label: 'Daily Quran Reading Reminder' },
              { key: 'streak_reminder', label: 'Streak Preservation Warning' }
            ].map((item) => {
              const val = (formData as any)[item.key] === 1;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60"
                >
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, [item.key]: val ? 0 : 1 })}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      val ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        val ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Official Mobile App Installation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900/90 border border-emerald-500/40 relative overflow-hidden shadow-2xl space-y-4">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img src="/logo.svg" alt="Majlis Al-Aman Logo" className="w-9 h-9 object-contain" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-lg text-white">Majlis Al-Aman Official Mobile App</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PWA & Capacitor
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  আপনার ডিভাইসে সরাসরি অ্যাপ হিসেবে ইন্সটল করুন। কোনো ইন্টারনেট ছাড়া অফলাইনে নামাজের ওয়াক্ত, কুরআন তিলাওয়াত ট্র্যাকার ও ডিজিটাল তাসবীহ ব্যবহার করুন।
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-emerald-400 font-semibold">
                  <span>✓ ফুল স্ক্রিন মোবাইল এক্সপেরিয়েন্স</span>
                  <span>✓ অফলাইন ডাটা সেভ</span>
                  <span>✓ ইনস্ট্যান্ট হোমস্ক্রিন অ্যাক্সেস</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {isInstalled ? (
                <div className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow-inner">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Installed on this Device ✓</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>এখনই অ্যাপ ইনস্টল করুন 📲</span>
                </button>
              )}
            </div>
          </div>

          {/* iOS Guide */}
          {isIOS && !isInstalled && (
            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> iPhone / iPad ইউজারদের জন্য:
              </p>
              <p className="text-[11px] text-slate-400">
                সাফারি ব্রাউজারের নিচে <strong>Share 📤</strong> বাটনে চাপ দিয়ে <strong>'Add to Home Screen' ➕</strong> সিলেক্ট করুন।
              </p>
            </div>
          )}
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
