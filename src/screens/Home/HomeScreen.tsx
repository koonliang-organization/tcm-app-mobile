import { useToast } from '@/components/Toast/ToastProvider';
import { DATA, countByCategory } from '@/data/mockData';
import { signOut } from '@/services/authService';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomCategoryNav } from './components/BottomCategoryNav';
import { CategoryBoxes } from './components/CategoryBoxes';
import { SearchBar } from './components/SearchBar';

export type Category = 'herbs' | 'recipes' | 'formulas' | 'acupuncture';
export type MainTab = 'home' | 'upload' | 'scan' | 'notifications' | 'profile';

export default function HomeScreen() {
  const router = useRouter();
  const { show } = useToast();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  const handleSignOut = async () => {
    await signOut();
    show('Signed out');
    router.replace('/auth/login');
  };

  const counts = useMemo(() => countByCategory(DATA), []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
      >
        <View style={styles.content}>
          <View style={styles.headerWrap}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            onOpenFilters={() => { /* UI only for now */ }}
          />
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
          <View style={{ height: 12 }} />
          </View>
        </View>
      </ScrollView>
      <BottomCategoryNav activeTab={activeTab} onSelectTab={setActiveTab} onSignOut={handleSignOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' },
  content: { paddingHorizontal: 16 },
  headerWrap: { paddingTop: 8 },
});
