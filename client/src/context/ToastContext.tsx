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
      duration: 4000,
      ...options
    };

    setToasts(prev => [newToast, ...prev.slice(0, 3)]); // show max 4 toasts

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
      <div className="fixed top-5 right-4 sm:right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl backdrop-blur-lg transition-all duration-300 transform translate-y-0 ${
                isSuccess
                  ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100 shadow-emerald-950/40'
                  : isError
                  ? 'bg-slate-900/90 border-rose-500/40 text-slate-100 shadow-rose-950/40'
                  : 'bg-slate-900/90 border-amber-500/40 text-slate-100 shadow-amber-950/40'
              }`}
            >
              <div className="flex items-center space-x-3 pr-2">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {toast.onUndo && (
                  <button
                    onClick={() => {
                      toast.onUndo?.();
                      removeToast(toast.id);
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{toast.undoLabel || 'Undo'}</span>
                  </button>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
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
