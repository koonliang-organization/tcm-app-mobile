import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ensureSeedUsers } from '@/data/mockData';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { hydrateSessionFromSecureStore } from '@/utils/secureSession';

export default function RootLayout() {
  const scheme = useColorScheme();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    (async () => {
      await hydrateSessionFromSecureStore();
      ensureSeedUsers();
      setHydrated(true);
    })();
  }, []);
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <ErrorBoundary>
        <ToastProvider>
          {hydrated ? (
            <Stack screenOptions={{ headerShown: false }} />
          ) : (
            // Minimal placeholder while hydrating session
            <></>
          )}
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
