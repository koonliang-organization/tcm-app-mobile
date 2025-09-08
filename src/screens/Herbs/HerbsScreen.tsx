import type { Herb } from '@/data/herbs';
import React, { useRef, useState } from 'react';
import { SectionList, SectionListData, SectionListRenderItem, StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomCategoryNav } from '../Home/components/BottomCategoryNav';
import { SearchBar } from '../Home/components/SearchBar';
import type { MainTab } from '../Home/HomeScreen';
import { AlphaIndexBar } from './components/AlphaIndexBar';
import { HerbCard } from './components/HerbCard';
import { useHerbsSections } from './hooks/useHerbsData';

export default function HerbsScreen() {
  const { sections, letters } = useHerbsSections();
  const listRef = useRef<SectionList<Herb>>(null);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [headerHeight, setHeaderHeight] = useState(0);
  const totalItems = sections.reduce((sum, s) => sum + s.data.length, 0);

  const onSelectIndex = (letter: string) => {
    // Web: use DOM anchor for reliable scroll
    if (Platform.OS === 'web') {
      const doc: any = (globalThis as any).document;
      const el = doc?.getElementById?.(`herb-section-${letter}`);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Offset by the search header height
        setTimeout(() => {
          try { (globalThis as any).scrollBy?.(0, -(headerHeight + 6)); } catch {}
        }, 50);
        return;
      }
      // If the anchor isn't mounted (due to virtualization), jump near the top
      // then retry so the element exists.
      const anyList: any = listRef.current as any;
      if (anyList?.scrollToOffset) {
        const targetIdx = letters.indexOf(letter);
        if (targetIdx !== -1 && targetIdx < letters.length / 2) {
          anyList.scrollToOffset({ offset: 0, animated: false });
        } else {
          // try approximate forward jump if target is later
          anyList.scrollToLocation?.({ sectionIndex: Math.min(sections.length - 1, targetIdx), itemIndex: 0, animated: false, viewPosition: 0 });
        }
        setTimeout(() => {
          const el2 = doc?.getElementById?.(`herb-section-${letter}`);
          if (el2 && el2.scrollIntoView) {
            el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
              try { (globalThis as any).scrollBy?.(0, -(headerHeight + 6)); } catch {}
            }, 30);
          }
        }, 80);
        return;
      }
    }
    // Native fallback: two-step SectionList jump
    const sectionIndex = sections.findIndex((s) => s.title === letter);
    if (sectionIndex < 0) return;
    listRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: false, viewPosition: 0 });
    setTimeout(() => {
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
        viewOffset: headerHeight + 4,
      });
    }, 60);
  };

  const renderItem: SectionListRenderItem<Herb> = ({ item }) => <HerbCard herb={item} />;
  const renderSectionHeader = ({ section }: { section: SectionListData<Herb> }) => (
    <View style={styles.header} nativeID={`herb-section-${(section as any).title}`}>
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
          initialNumToRender={Platform.OS === 'web' ? Math.min(totalItems + sections.length, 1000) : 16}
          windowSize={Platform.OS === 'web' ? 1000 : 10}
          maxToRenderPerBatch={Platform.OS === 'web' ? Math.min(200, totalItems + sections.length) : 24}
          removeClippedSubviews={Platform.OS !== 'web'}
          contentContainerStyle={{ paddingBottom: 96 + insets.bottom, paddingTop: 4, paddingHorizontal: 16 }}
          ListHeaderComponent={
            <View
              style={{ paddingTop: 8 }}
              onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
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
  container: { flex: 1, backgroundColor: '#fafafa', overflow: 'hidden' },
  header: { backgroundColor: '#f2f2f7', paddingVertical: 6, paddingHorizontal: 16 },
  headerTxt: { fontSize: 13, fontWeight: '600', color: '#333' },
});
