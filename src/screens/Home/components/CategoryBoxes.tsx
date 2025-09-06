import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import type { Category } from '../HomeScreen';

// Accepts the same keys as Category (except 'all') from HomeScreen
type Props = {
  selected: Category | null;
  onSelect: (key: Category) => void;
  counts?: Partial<Record<Category, number>>;
};

// The mapping requested by PM/spec:
// Ginseng -> Herbs, Chamomile -> Recipes, Pancake -> Formulas, Salad -> Acupuncture
const BOXES: { key: Category; title: string; color: string }[] = [
  { key: 'herbs', title: 'Herbs', color: '#E9F7EF' },
  { key: 'recipes', title: 'Recipes', color: '#FFF5E6' },
  { key: 'formulas', title: 'Formulas', color: '#EAF2FF' },
  { key: 'acupuncture', title: 'Acupuncture', color: '#E6FFF2' },
];

const IMG_BY_CATEGORY: Record<Category, any> = {
  herbs: require('../../../../assets/herbs.jpg'),
  recipes: require('../../../../assets/recipes.png'),
  formulas: require('../../../../assets/formulas.png'),
  acupuncture: require('../../../../assets/acupuncture.png'),
};

export function CategoryBoxes({ selected, onSelect, counts }: Props) {
  return (
    <View style={styles.grid} accessibilityLabel="Category boxes">
      {BOXES.map((b) => {
        const active = selected != null && selected === b.key;
        const count = counts?.[b.key] ?? 0;
        return (
          <Pressable
            key={b.key}
            onPress={() => onSelect(b.key)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: b.color },
              active && styles.active,
              pressed && { opacity: 0.95 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${b.title} category, ${count} items`}
          >
            <Image source={IMG_BY_CATEGORY[b.key]} style={styles.thumb} resizeMode="cover" />
            <Text style={styles.title}>{b.title}</Text>
            <Text style={styles.count}>{count} items</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 12,
    gap: 12,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 0,
  },
  active: {
    borderWidth: 2,
    borderColor: '#1FB673',
  },
  thumb: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: { color: '#1C1C1E', fontWeight: '700', fontSize: 16 },
  count: { color: '#6B7280', marginTop: 2, fontWeight: '600' },
});
