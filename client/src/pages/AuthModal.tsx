import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, CheckCircle2, ShieldCheck, KeyRound, RefreshCw, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'forgot'>(initialMode === 'forgot' ? 'forgot' : 'login');
  
  // Login form fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password OTP flow
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Google OAuth Login & 1-Click Sign-Up Hook
  const triggerGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const googleUser = await userInfoRes.json();

        if (googleUser && googleUser.email) {
          await loginWithGoogle({
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split('@')[0],
            avatar: googleUser.picture,
            googleId: googleUser.sub
          });
          onClose();
        } else {
          throw new Error('Could not retrieve profile from Google');
        }
      } catch (err: any) {
        console.error('Google OAuth Error:', err);
        setError(err.message || 'Google authentication failed');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (errResponse) => {
      console.warn('Google login failed or closed:', errResponse);
      setError('Google Sign-In was cancelled or failed. Please use email & password.');
    }
  });

  const handleGoogleClick = () => {
    setError(null);
    triggerGoogleOAuth();
  };

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your account email address');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotStep('otp');
      setResendTimer(60); // 60s cooldown
      setResetSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.message || 'Could not send reset code. Please check email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the valid 6-digit OTP code sent to your email');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword({
        email: forgotEmail.trim().toLowerCase(),
        otpCode: otpCode.trim(),
        newPassword,
        confirmPassword: confirmNewPassword
      });

      setResetSuccessMsg(res.message || 'Password reset successfully!');
      setLoginIdentifier(forgotEmail);
      setPassword(newPassword);

      setTimeout(() => {
        setMode('login');
        setForgotStep('email');
        setResetSuccessMsg('Your password has been updated! You can now sign in.');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please verify your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!loginIdentifier || !password) {
        throw new Error('Please enter your email/username and password');
      }
      await login({ login: loginIdentifier, password });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check your email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 transform transition-all relative overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative ambient glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="Majlis Al-Aman Logo" className="w-9 h-9 object-contain" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' && 'Sign In to Majlis'}
            {mode === 'forgot' && (forgotStep === 'email' ? 'Reset Password' : 'Enter 6-Digit OTP')}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login' && 'Track your 5 daily prayers, tilawah streaks & spiritual sanctuary'}
            {mode === 'forgot' && (forgotStep === 'email' 
              ? 'Enter your account email to receive an instant OTP code' 
              : `Enter the 6-digit OTP code sent to ${forgotEmail}`)}
          </p>
        </div>

        {/* Primary 1-Click Google Sign-In & Sign-Up Button */}
        {mode === 'login' && (
          <div className="mb-5 space-y-3">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl shadow-white/10 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 border border-slate-200"
            >
              {/* Google G Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google (1-Click Sign In)'}</span>
            </button>
            <p className="text-[10px] text-center text-emerald-400/90 font-medium">
              ✨ Sign in or create an account instantly with Google
            </p>

            <div className="flex items-center space-x-3 my-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">or with email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-rose-400 font-bold ml-2">×</button>
          </div>
        )}

        {/* Success Message */}
        {resetSuccessMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{resetSuccessMsg}</span>
          </div>
        )}

        {/* EMAIL LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="your@email.com or username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { 
                    setMode('forgot'); 
                    setForgotStep('email');
                    setForgotEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                    setError(null); 
                    setResetSuccessMsg(null); 
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 transform active:scale-[0.99] mt-2"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In with Password →'}</span>
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD 2-STEP REAL-TIME OTP FLOW */}
        {mode === 'forgot' && forgotStep === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Enter Your Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                A 6-digit verification OTP code will be sent immediately to your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 transform active:scale-[0.99]"
            >
              <Mail className="w-4 h-4" />
              <span>{isLoading ? 'Sending OTP Code...' : 'Send OTP Code →'}</span>
            </button>
          </form>
        )}

        {mode === 'forgot' && forgotStep === 'otp' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            {/* 6-Digit OTP Box */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  6-Digit OTP Code *
                </label>
                {resendTimer > 0 ? (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                )}
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-center tracking-[6px] text-lg focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                New Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 transform active:scale-[0.99] mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Resetting Password...' : 'Reset Password & Sign In 🔒'}</span>
            </button>
          </form>
        )}

        {/* Footer Navigation Switcher */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'forgot' ? (
            <div className="flex justify-between items-center">
              {forgotStep === 'otp' && (
                <button
                  type="button"
                  onClick={() => { setForgotStep('email'); setError(null); }}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← Change Email
                </button>
              )}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setResetSuccessMsg(null); }}
                className="text-emerald-400 hover:text-emerald-300 font-bold ml-auto transition-colors"
              >
                Back to Sign In →
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-[11px]">
              🔒 Protected with industry standard encryption
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
