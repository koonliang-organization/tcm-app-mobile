import { useToast } from '@/components/Toast/ToastProvider';
import { getCurrentUser, signOut } from '@/services/authService';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { BottomCategoryNav } from './components/BottomCategoryNav';
import { CategoryBoxes } from './components/CategoryBoxes';
import { SearchBar } from './components/SearchBar';
import { DATA, countByCategory } from './data';

export type Category = 'herbs' | 'recipes' | 'formulas' | 'acupuncture';
export type MainTab = 'home' | 'upload' | 'scan' | 'notifications' | 'profile';

export default function HomeScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const { show } = useToast();

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
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
            onSelect={(key) => setCategory(key)}
          />
          <View style={{ height: 12 }} />
        </View>
      </ScrollView>
      <BottomCategoryNav activeTab={activeTab} onSelectTab={setActiveTab} onSignOut={handleSignOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrap: { paddingTop: 8, paddingHorizontal: 16 },
});
