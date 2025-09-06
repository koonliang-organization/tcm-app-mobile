import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { getCurrentUser } from '@/services/authService';

export default function ProtectedLayout() {
  const user = getCurrentUser();
  if (!user) {
    return <Redirect href="/auth/login" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

