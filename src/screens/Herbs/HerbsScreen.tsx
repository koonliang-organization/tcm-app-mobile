import type { Herb } from '@/data/herbs';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, SectionList, SectionListData, SectionListRenderItem, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomCategoryNav } from '../Home/components/BottomCategoryNav';
import { SearchBar } from '../Home/components/SearchBar';
import type { MainTab } from '../Home/HomeScreen';
import { AlphaIndexBar } from './components/AlphaIndexBar';
import { HerbCard } from './components/HerbCard';
import { useHerbsSections } from './hooks/useHerbsData';

export default function HerbsScreen() {
  const { sections, letters } = useHerbsSections();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const filteredSections = useMemo(() => {
    if (!selectedLetter) return sections;
    return sections.filter(section => section.title === selectedLetter);
  }, [sections, selectedLetter]);
  
  const totalItems = filteredSections.reduce((sum, s) => sum + s.data.length, 0);
  
  const handleTabSelect = useCallback((tab: MainTab) => {
    if (tab === 'home') {
      router.push('/(protected)/');
    } else {
      setActiveTab(tab);
    }
  }, [router]);
  



  const onSelectIndex = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  const renderItem: SectionListRenderItem<Herb> = ({ item, section, index }) => {
    const sectionTitle = (section as any)?.title || '';
    return (
      <View nativeID={`herb-item-${sectionTitle}-${index}`}>
        <HerbCard herb={item} />
      </View>
    );
  };
  const renderSectionHeader = ({ section }: { section: SectionListData<Herb> }) => (
    <View style={styles.header} nativeID={`herb-section-${(section as any).title}`}>
      <Text style={styles.headerTxt}>{section.title}</Text>
    </View>
  );


  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flex: 1 }}>
        <SectionList
          sections={filteredSections as any}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          initialNumToRender={Platform.OS === 'web' ? Math.min(totalItems + filteredSections.length, 1000) : Platform.OS === 'android' ? 30 : 16}
          windowSize={Platform.OS === 'web' ? 1000 : Platform.OS === 'android' ? 15 : 10}
          maxToRenderPerBatch={Platform.OS === 'web' ? Math.min(200, totalItems + filteredSections.length) : Platform.OS === 'android' ? 30 : 24}
          contentContainerStyle={{ paddingBottom: 96 + insets.bottom, paddingTop: 4, paddingHorizontal: 16 }}
          ListHeaderComponent={
            <View style={{ paddingTop: 8 }}>
              <SearchBar value={query} onChangeText={setQuery} placeholder="Search herbs" onOpenFilters={() => {}} />
              {selectedLetter && (
                <View style={styles.filterInfo}>
                  <Text style={styles.filterText}>Showing herbs starting with &ldquo;{selectedLetter}&rdquo;</Text>
                  <Pressable onPress={() => setSelectedLetter(null)} style={styles.clearFilter}>
                    <Text style={styles.clearFilterText}>Clear</Text>
                  </Pressable>
                </View>
              )}
              <View style={{ height: 8 }} />
            </View>
          }
        />
        <AlphaIndexBar letters={letters} onSelect={onSelectIndex} />
      </View>
      <BottomCategoryNav activeTab={activeTab} onSelectTab={handleTabSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', overflow: 'hidden' },
  header: { backgroundColor: '#f2f2f7', paddingVertical: 6, paddingHorizontal: 16 },
  headerTxt: { fontSize: 13, fontWeight: '600', color: '#333' },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#1565c0',
    fontWeight: '500',
  },
  clearFilter: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#1565c0',
  },
  clearFilterText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});
