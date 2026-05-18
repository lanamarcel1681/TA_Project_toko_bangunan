'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-orange-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    };

    const colors = {
        success: 'border-green-100 bg-green-50 text-green-950',
        error: 'border-red-100 bg-red-50 text-red-950',
        info: 'border-orange-100 bg-orange-50 text-orange-950',
        warning: 'border-orange-100 bg-orange-50 text-orange-950',
    };

    return (
        <div className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[24px] border shadow-2xl animate-in slide-in-from-right-full duration-500 min-w-[320px] max-w-md ${colors[toast.type]}`}>
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-black tracking-tight leading-tight">{toast.message}</p>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
