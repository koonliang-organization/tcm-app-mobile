import React, { useMemo, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import type { Category } from '../HomeScreen';
import type { Item } from '../data';
import { DATA } from '../data';

type Props = { query: string; category: Category; ListHeaderComponent?: React.ReactElement };

export function ResultsList({ query, category, ListHeaderComponent }: Props) {
  const items = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const base = DATA.filter((d) => d.category === category);
    if (!lower) return base;
    return base.filter((d) => d.title.toLowerCase().includes(lower) || d.subtitle.toLowerCase().includes(lower));
  }, [query, category]);

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingBottom: 96, paddingHorizontal: 16 }}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={({ item }) => <MemoCard item={item} />}
      // Large list tuning
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      removeClippedSubviews
      ListEmptyComponent={() => (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <Text style={{ color: '#8E8E93' }}>No results. Try a different query.</Text>
        </View>
      )}
    />
  );
}

function Card({ item }: { item: Item }) {
  return (
    <View
      style={[styles.card, { backgroundColor: item.color }]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}`}
    >
      <View style={styles.thumb}>
        <Text style={styles.heart}>♡</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );
}

const MemoCard = React.memo(Card);

const styles = StyleSheet.create({
  row: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    minHeight: 160,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumb: {
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ffffffaa',
    marginBottom: 8,
    position: 'relative',
  },
  heart: { position: 'absolute', right: 8, top: 6, fontSize: 16, color: '#fff' },
  title: { fontWeight: '700', fontSize: 16, color: '#1C1C1E' },
  subtitle: { marginTop: 2, color: '#6B7280' },
});
