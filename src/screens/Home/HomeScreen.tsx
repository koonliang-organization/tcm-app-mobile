import { useToast } from '@/components/Toast/ToastProvider';
import { DATA, countByCategory } from '@/data/mockData';
import { signOut } from '@/services/authService';
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomCategoryNav } from './components/BottomCategoryNav';
import { CategoryBoxes } from './components/CategoryBoxes';

export type Category = 'herbs' | 'recipes' | 'formulas' | 'acupuncture';
export type MainTab = 'home' | 'upload' | 'scan' | 'notifications' | 'profile';

export default function HomeScreen() {
  const router = useRouter();
  const { show } = useToast();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  const handleSignOut = async () => {
    await signOut();
    show('Signed out');
    router.replace('/auth/login');
  };

  const handleTabSelect = useCallback((tab: MainTab) => {
    if (tab === 'home') {
      // Already on home, no navigation needed
      setActiveTab(tab);
    } else {
      // For other tabs, just update state for now
      setActiveTab(tab);
    }
  }, []);

  const counts = useMemo(() => countByCategory(DATA), []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 96 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <CategoryBoxes
          selected={category}
          counts={counts}
          onSelect={(key) => {
            setCategory(key);
            if (key === 'herbs') {
              router.push('/(protected)/herbs');
            }
          }}
        />
      </ScrollView>
      <BottomCategoryNav activeTab={activeTab} onSelectTab={handleTabSelect} onSignOut={handleSignOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' },
  scrollView: { flex: 1 },
  content: { 
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: 'center',
  },
});
