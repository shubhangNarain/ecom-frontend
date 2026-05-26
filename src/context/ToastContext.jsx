import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const icons = {
    success: <CheckCircle className="text-accent shrink-0" size={18} />,
    error: <AlertCircle className="text-red-500 shrink-0" size={18} />,
    info: <Info className="text-accent shrink-0" size={18} />,
  };

  const bgStyles = {
    success: 'border-l-accent border-accent/10 shadow-[0_10px_30px_rgba(198,241,53,0.15)]',
    error: 'border-l-red-500 border-red-500/10 shadow-[0_10px_30px_rgba(239,68,68,0.15)]',
    info: 'border-l-accent/70 border-accent/10 shadow-[0_10px_30px_rgba(198,241,53,0.12)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto w-full bg-black/95 backdrop-blur-md text-white border-y border-r border-l-4 rounded-xl p-4 flex items-center justify-between gap-4 ${bgStyles[toast.type] || bgStyles.success}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icons[toast.type] || icons.success}
        <p className="font-display font-semibold text-xs tracking-wide text-gray-100 truncate pr-1">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-accent hover:text-black transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-xs md:max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
