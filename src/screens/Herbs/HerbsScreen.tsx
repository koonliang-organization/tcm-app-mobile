import React, { useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionList, SectionListData, SectionListRenderItem, StyleSheet, Text, View } from 'react-native';
import type { Herb } from '@/data/herbs';
import { HerbCard } from './components/HerbCard';
import { AlphaIndexBar } from './components/AlphaIndexBar';
import { useHerbsSections } from './hooks/useHerbsData';
import { SearchBar } from '../Home/components/SearchBar';
import { BottomCategoryNav } from '../Home/components/BottomCategoryNav';
import type { MainTab } from '../Home/HomeScreen';

export default function HerbsScreen() {
  const { sections, letters } = useHerbsSections();
  const listRef = useRef<SectionList<Herb>>(null);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  const onSelectIndex = (sectionIndex: number) => {
    const s = sections[sectionIndex];
    if (!s) return;
    listRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: true, viewPosition: 0 });
  };

  const renderItem: SectionListRenderItem<Herb> = ({ item }) => <HerbCard herb={item} />;
  const renderSectionHeader = ({ section }: { section: SectionListData<Herb> }) => (
    <View style={styles.header}>
      <Text style={styles.headerTxt}>{section.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flex: 1 }}>
        <SectionList
          ref={listRef}
          sections={sections as any}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 96 + insets.bottom, paddingTop: 4, paddingRight: insets.right }}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
              <SearchBar value={query} onChangeText={setQuery} placeholder="Search herbs" onOpenFilters={() => {}} />
              <View style={{ height: 8 }} />
            </View>
          }
        />
        <AlphaIndexBar letters={letters} onSelect={onSelectIndex} />
      </View>
      <BottomCategoryNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { backgroundColor: '#f2f2f7', paddingVertical: 6, paddingHorizontal: 16 },
  headerTxt: { fontSize: 13, fontWeight: '600', color: '#333' },
});
