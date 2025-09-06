import React, { useMemo } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import type { Category } from '../HomeScreen';

type Item = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, 'all'>;
  color: string;
};

const DATA: Item[] = [
  { id: 'h1', title: 'Ginseng', subtitle: 'Energy • Root', category: 'herbs', color: '#E9F7EF' },
  { id: 'h2', title: 'Chamomile', subtitle: 'Calming • Flower', category: 'herbs', color: '#FFF5E6' },
  { id: 'r1', title: 'Pancake', subtitle: 'Food • <60 mins', category: 'recipes', color: '#EAF2FF' },
  { id: 'r2', title: 'Salad', subtitle: 'Food • <30 mins', category: 'recipes', color: '#E6FFF2' },
  { id: 'f1', title: 'Digestive Mix', subtitle: 'Powder • Herbs', category: 'formulas', color: '#F8E6FF' },
  { id: 'f2', title: 'Sleep Tonic', subtitle: 'Tincture • Night', category: 'formulas', color: '#FFE6EF' },
];

type Props = { query: string; category: Category; ListHeaderComponent?: React.ReactElement };

export function ResultsList({ query, category, ListHeaderComponent }: Props) {
  const items = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const base = category === 'all' ? DATA : DATA.filter((d) => d.category === category);
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
      renderItem={({ item }) => <Card item={item} />}
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
