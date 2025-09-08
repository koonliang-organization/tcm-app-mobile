import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AlphaIndexBar({ letters, onSelect }: { letters: string[]; onSelect: (index: number) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { right: (insets.right || 0) + 6, top: insets.top, bottom: insets.bottom }]}
    >
      <View style={styles.col}>
        {letters.map((l, i) => (
          <Pressable
            key={`${l}-${i}`}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
            accessibilityLabel={`Jump to ${l}`}
          >
            <Text style={styles.txt}>{l}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 0,
  },
  col: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  item: { paddingVertical: 2, paddingHorizontal: 4, borderRadius: 4 },
  pressed: { backgroundColor: 'rgba(0,0,0,0.06)' },
  txt: { fontSize: 11, color: '#333' },
});
