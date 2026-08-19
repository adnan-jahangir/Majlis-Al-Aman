import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  id?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onUndo?: () => void;
  undoLabel?: string;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      type: 'success',
      duration: 2200,
      ...options
    };

    // Show only the latest toast (max 1) so rapid clicks don't stack up and block screen
    setToasts([newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex flex-col pointer-events-none max-w-[320px] sm:max-w-sm w-full">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
                isSuccess
                  ? 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/30'
                  : isError
                  ? 'bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-950/30'
                  : 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-950/30'
              }`}
            >
              <div className="flex items-center space-x-2.5 pr-2 min-w-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <p className="text-xs sm:text-sm font-medium leading-tight truncate">{toast.message}</p>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {toast.onUndo && (
                  <button
                    onClick={() => {
                      toast.onUndo?.();
                      removeToast(toast.id);
                    }}
                    className="flex items-center space-x-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>{toast.undoLabel || 'Undo'}</span>
                  </button>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
