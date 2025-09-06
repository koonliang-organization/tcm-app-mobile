import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Item = { key: string; label: string };

type Props = {
  items: readonly Item[] | Item[];
  selected: string;
  onSelect: (key: string) => void;
};

export function CategoryChips({ items, selected, onSelect }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist" accessibilityLabel="Categories">
      {items.map((it) => {
        const active = it.key === selected || (selected === 'all' && it.key === 'all');
        return (
          <Pressable
            key={it.key}
            onPress={() => onSelect(it.key)}
            style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.9 }]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={it.label}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#1FB673',
    borderColor: '#1FB673',
  },
  label: { color: '#3C3C43', fontWeight: '600' },
  labelActive: { color: '#fff' },
});
