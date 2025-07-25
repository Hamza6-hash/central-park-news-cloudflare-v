'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import CustomToast from '@/components/ui/customToast'; 

type ToastType = 'success' | 'error' | 'alreadyUnsubscribed';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextProps {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    title: 'Success',
    description: 'Operation completed.',
    type: 'success',
  });

  const showToast = useCallback((options: ToastOptions) => {
    setToastOptions({
      title: options.title ?? 'Success',
      description: options.description ?? '',
      type: options.type ?? 'success',
    });
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast
        show={isVisible}
        onClose={() => setIsVisible(false)}
        title={toastOptions.title}
        description={toastOptions.description}
        type={toastOptions.type}
      />
    </ToastContext.Provider>
  );
};
