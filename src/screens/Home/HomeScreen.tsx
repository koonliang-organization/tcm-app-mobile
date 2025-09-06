import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser, signOut } from '@/services/authService';
import { useToast } from '@/components/Toast/ToastProvider';
import { SearchBar } from './components/SearchBar';
import { CategoryChips } from './components/CategoryChips';
import { BottomCategoryNav } from './components/BottomCategoryNav';
import { ResultsList } from './components/ResultsList';

export type Category = 'all' | 'herbs' | 'recipes' | 'formulas';
export type MainTab = 'home' | 'upload' | 'scan' | 'notifications' | 'profile';

export default function HomeScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const { show } = useToast();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  const handleSignOut = async () => {
    await signOut();
    show('Signed out');
    router.replace('/auth/login');
  };

  const chips = useMemo(
    () => [
      { key: 'all', label: 'All' },
      { key: 'herbs', label: 'Herbs' },
      { key: 'recipes', label: 'Recipes' },
      { key: 'formulas', label: 'Formulas' },
    ] as const,
    []
  );

  const Header = (
    <View style={styles.headerWrap}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search Herbs, Recipes, Formulas"
        onOpenFilters={() => { /* UI only for now */ }}
      />
      <Text style={styles.sectionTitle}>Category</Text>
      <CategoryChips
        items={chips}
        selected={category}
        onSelect={(key) => setCategory(key as Category)}
      />
      <View style={{ height: 12 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ResultsList query={query} category={category} ListHeaderComponent={Header} />
      <BottomCategoryNav activeTab={activeTab} onSelectTab={setActiveTab} onSignOut={handleSignOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrap: { paddingTop: 8 },
  sectionTitle: { marginTop: 14, marginBottom: 6, fontWeight: '700', color: '#1C1C1E' },
});
