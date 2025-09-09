import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AlphaIndexBar({ letters, onSelect }: { letters: string[]; onSelect: (letter: string) => void }) {
  const insets = useSafeAreaInsets();
  console.log('[AlphaIndexBar] Received letters:', letters);
  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { right: (insets.right || 0) + 2, top: insets.top, bottom: insets.bottom }]}
    >
      <View style={styles.col}>
        {letters.map((l, i) => (
          <Pressable
            key={`${l}-${i}`}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => {
              console.log(`[AlphaIndexBar] Letter pressed: ${l}`);
              onSelect(l);
            }}
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
  item: { paddingVertical: 4, paddingHorizontal: 6, borderRadius: 4 },
  pressed: { backgroundColor: 'rgba(0,0,0,0.06)' },
  txt: { fontSize: 13, color: '#333' },
});
