import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Majlis Al-Aman:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <img src="/logo.svg" alt="Majlis Logo" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Majlis Al-Aman</h1>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            Something unexpected occurred. Tap below to reload your peaceful sanctuary.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('majlis_cache_clear');
              window.location.reload();
            }}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            Reload Sanctuary 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '506676534293-mmhm6pok95pk1buq1jfgq56cvtfjpbop.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      ) : (
        <App />
      )}
    </RootErrorBoundary>
  </StrictMode>,
);
