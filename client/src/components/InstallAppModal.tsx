import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check, Share, PlusSquare } from 'lucide-react';

interface InstallAppModalProps {
  isOpenManual?: boolean;
  onCloseManual?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpenManual = false,
  onCloseManual
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is already running as installed PWA or native app
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for standard Chromium / Android / Desktop PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Auto-open modal on first website entrance if not dismissed recently
      const lastDismissed = localStorage.getItem('majlis_install_prompt_dismissed');
      const shouldShow = !lastDismissed || (Date.now() - Number(lastDismissed)) > (1000 * 60 * 60 * 24 * 3); // 3 days cooldown

      if (shouldShow) {
        setTimeout(() => {
          setIsOpen(true);
        }, 1200);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not dismissed recently, also show install instructions
    if (isIosDevice && !isStandalone) {
      const lastDismissed = localStorage.getItem('majlis_install_prompt_dismissed');
      const shouldShow = !lastDismissed || (Date.now() - Number(lastDismissed)) > (1000 * 60 * 60 * 24 * 3);
      if (shouldShow) {
        setTimeout(() => {
          setIsOpen(true);
        }, 1500);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Sync manual trigger
  useEffect(() => {
    if (isOpenManual) {
      setIsOpen(true);
    }
  }, [isOpenManual]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('majlis_install_prompt_dismissed', String(Date.now()));
    if (onCloseManual) onCloseManual();
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // Keep open to show iOS steps
    } else {
      // Fallback for browsers
      alert("To install, click the browser menu (⋮) and select 'Install app' or 'Add to Home screen'.");
      handleClose();
    }
  };

  if (!isOpen || isInstalled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-7 shadow-2xl shadow-emerald-950/50 relative overflow-hidden text-center transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Logo & Badge */}
        <div className="relative mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
            <span className="font-arabic text-3xl font-bold">م</span>
          </div>
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-900"></span>
          </span>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full font-cinzel">
          Official Mobile App Available
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-white mt-3 tracking-tight">
          Install Majlis Al-Aman App
        </h3>
        
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          আপনার ফোনে সরাসরি অ্যাপ হিসেবে ইনস্টল করুন। অফলাইনে নামাজের সময়সূচি, কুরআন তিলাওয়াত ট্র্যাকার ও আযানের অ্যালার্ম পান।
        </p>

        {/* Features Highlights */}
        <div className="my-5 p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.07] text-left space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>১-ক্লিকে ফুল স্ক্রিন মোবাইল অ্যাপ এক্সপেরিয়েন্স</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>সম্পূর্ণ অফলাইন সাপোর্ট ও ডাটা সেভ সুবিধা</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>ফোনের হোমস্ক্রিন থেকে সরাসরি ওপেন</span>
          </div>
        </div>

        {/* iOS Specific Instructions */}
        {isIOS ? (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-2 mb-4 text-xs text-slate-300">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> iPhone / iPad এ ইনস্টল করার নিয়ম:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
              <li>সাফারি ব্রাউজারের নিচে <Share className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> <strong>Share</strong> বাটনে চাপ দিন</li>
              <li>নিচে স্ক্রল করে <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> <strong>'Add to Home Screen'</strong> সিলেক্ট করুন</li>
              <li>উপরে <strong>'Add'</strong> বাটনে চাপ দিন</li>
            </ol>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            পরে করব (Later)
          </button>
          
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>এখনই ইনস্টল করুন 📲</span>
          </button>
        </div>
      </div>
    </div>
  );
};
