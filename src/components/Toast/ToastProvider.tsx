import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Platform, Text, ToastAndroid, View } from 'react-native';

type ToastOptions = { duration?: number };

type ToastContextValue = {
  show: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
    setMessage(null);
  }, []);

  const show = useCallback((msg: string, opts?: ToastOptions) => {
    const duration = opts?.duration ?? 2000;
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, duration >= 3500 ? ToastAndroid.LONG : ToastAndroid.SHORT);
      return;
    }
    // Simple in-app overlay for iOS/web
    setMessage(msg);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(hide, duration);
  }, [hide]);

  const value = useMemo<ToastContextValue>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 40,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              maxWidth: '90%',
              backgroundColor: 'rgba(0,0,0,0.85)',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14 }}>{message}</Text>
          </View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

