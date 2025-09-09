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
    
    if (sectionIndex < 0) {
      return;
    }

    const section = sections[sectionIndex];
    if (!section.data.length) {
      return;
    }

    // For Android, scroll to the first item in the section (not the header)
    if (Platform.OS === 'android') {
      // Scroll to the first herb item in this section
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0, // First item in the section
        animated: true,
        viewPosition: 0, // Position at top of viewport
      });
    } else {
      // iOS and web: use existing logic but also target first item
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0, // First item in the section
        animated: true,
        viewPosition: 0,
        viewOffset: headerHeight + 4,
      });
    }
  }, [sections, sectionIndexer, headerHeight]);

  const onSelectIndex = (letter: string) => {
    // Web: use SectionList scrollToLocation primarily, with DOM as backup
    if (Platform.OS === 'web') {
      const sectionIndex = sections.findIndex((s) => s.title === letter);
      
      if (sectionIndex >= 0) {
        // Use SectionList's scrollToLocation which should work for both up and down
        listRef.current?.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          animated: true,
          viewPosition: 0,
          viewOffset: headerHeight + 6, // Account for header offset
        });
        
        // Try DOM fallback after a short delay in case SectionList didn't work
        setTimeout(() => {
          const doc: any = (globalThis as any).document;
          const el = doc?.getElementById?.(`herb-section-${letter}`);
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
              try { (globalThis as any).scrollBy?.(0, -(headerHeight + 6)); } catch {}
            }, 50);
          }
        }, 200);
        return;
      }
    }
    
    // Native: use our improved scrollToSection method
    scrollToSection(letter);
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

  // Accurate getItemLayout to help Android with scroll positioning
  const getItemLayout = useCallback((data: any, index: number) => {
    if (Platform.OS !== 'android') return undefined;
    
    // More precise heights based on actual component styles
    const ITEM_HEIGHT = 88; // HerbCard: padding(12*2) + minHeight(64) + marginVertical(6*2) = 88
    const HEADER_HEIGHT = 32; // Section header height
    
    // SectionList flattens sections and items into a single list
    // We need to calculate which "row" this index represents
    let currentIndex = 0;
    let offset = 0;
    
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      // Section header
      if (currentIndex === index) {
        return {
          length: HEADER_HEIGHT,
          offset,
          index,
        };
      }
      if (currentIndex > index) break;
      
      offset += HEADER_HEIGHT;
      currentIndex++;
      
      // Section items
      const section = sections[sectionIndex];
      for (let itemIndex = 0; itemIndex < section.data.length; itemIndex++) {
        if (currentIndex === index) {
          return {
            length: ITEM_HEIGHT,
            offset,
            index,
          };
        }
        if (currentIndex > index) break;
        
        offset += ITEM_HEIGHT;
        currentIndex++;
      }
    }
    
    // Fallback
    return {
      length: ITEM_HEIGHT,
      offset: index * ITEM_HEIGHT,
      index,
    };
  }, [sections]);

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
          maintainVisibleContentPosition={Platform.OS === 'web' ? undefined : null}
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
