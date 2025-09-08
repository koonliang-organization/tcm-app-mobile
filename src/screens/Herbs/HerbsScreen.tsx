import type { Herb } from '@/data/herbs';
import React, { useRef, useState, useCallback, useMemo } from 'react';
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
  
  // Debug letters vs sections alignment
  console.log('[HerbsScreen] Letters from hook:', letters);
  console.log('[HerbsScreen] Sections from hook:', sections.map(s => s.title));

  // Android SectionIndexer-like implementation
  const sectionIndexer = useMemo(() => {
    if (Platform.OS !== 'android') return null;
    
    const getSections = () => letters;
    
    const getPositionForSection = (sectionIndex: number): number => {
      if (sectionIndex < 0 || sectionIndex >= sections.length) return 0;
      
      // In a SectionList, the flat position is just the cumulative count of items
      // The section headers are handled separately by SectionList
      let position = 0;
      for (let i = 0; i < sectionIndex; i++) {
        position += sections[i].data.length; // Only count items, not headers
      }
      return position;
    };
    
    const getSectionForPosition = (position: number): number => {
      let currentPos = 0;
      for (let i = 0; i < sections.length; i++) {
        const sectionSize = sections[i].data.length; // Only items, no headers
        if (position < currentPos + sectionSize) {
          return i;
        }
        currentPos += sectionSize;
      }
      return sections.length - 1;
    };
    
    return {
      getSections,
      getPositionForSection,
      getSectionForPosition,
    };
  }, [sections, letters]);

  const scrollToSection = useCallback((letter: string) => {
    const sectionIndex = sections.findIndex((s) => s.title === letter);
    console.log(`[HerbsScreen] scrollToSection: ${letter} -> sectionIndex: ${sectionIndex}`);
    
    // Log all sections for debugging
    console.log(`[HerbsScreen] All sections:`, sections.map((s, i) => `${i}: ${s.title} (${s.data.length} items)`));
    
    if (sectionIndex < 0) {
      console.warn(`[HerbsScreen] Section not found for letter: ${letter}`);
      return;
    }

    // For Android, try simpler approach first
    if (Platform.OS === 'android') {
      console.log(`[HerbsScreen] Android scrolling to section ${sectionIndex} (${letter})`);
      
      // Try direct scrollToLocation with no viewPosition/viewOffset to see if that works
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
        viewPosition: 0, // Top of viewport
      });
    } else {
      // iOS and web: use existing logic
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
        viewOffset: headerHeight + 4,
      });
    }
  }, [sections, sectionIndexer, headerHeight]);

  const onSelectIndex = (letter: string) => {
    console.log(`[HerbsScreen] onSelectIndex called with letter: ${letter}, Platform: ${Platform.OS}`);
    
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
    
    // Native: use our improved scrollToSection method
    scrollToSection(letter);
  };

  const renderItem: SectionListRenderItem<Herb> = ({ item }) => <HerbCard herb={item} />;
  const renderSectionHeader = ({ section }: { section: SectionListData<Herb> }) => (
    <View style={styles.header} nativeID={`herb-section-${(section as any).title}`}>
      <Text style={styles.headerTxt}>{section.title}</Text>
    </View>
  );

  // Android-specific getItemLayout for better scrolling performance
  const getItemLayout = useCallback((data: any, index: number) => {
    if (Platform.OS !== 'android') return undefined;
    
    const ITEM_HEIGHT = 80; // Estimated height of HerbCard
    const HEADER_HEIGHT = 32; // Estimated height of section header
    
    return {
      length: ITEM_HEIGHT,
      offset: index * ITEM_HEIGHT,
      index,
    };
  }, []);

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
          initialNumToRender={Platform.OS === 'web' ? Math.min(totalItems + sections.length, 1000) : Platform.OS === 'android' ? 30 : 16}
          windowSize={Platform.OS === 'web' ? 1000 : Platform.OS === 'android' ? 15 : 10}
          maxToRenderPerBatch={Platform.OS === 'web' ? Math.min(200, totalItems + sections.length) : Platform.OS === 'android' ? 30 : 24}
          removeClippedSubviews={Platform.OS === 'android' ? false : Platform.OS !== 'web'}
          getItemLayout={Platform.OS === 'android' ? getItemLayout : undefined}
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
