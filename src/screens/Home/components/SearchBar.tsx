import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { SearchIcon } from '@/components/Icons';

type Props = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onOpenFilters?: () => void;
};

export function SearchBar({ value, placeholder, onChangeText, onOpenFilters }: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  // Simple debounce ~300ms
  useEffect(() => {
    const id = setTimeout(() => {
      if (local !== value) onChangeText(local);
    }, 300);
    return () => clearTimeout(id);
  }, [local]);

  return (
    <View style={styles.wrapper} accessibilityRole="search" accessibilityLabel="Global search">
      <View style={styles.inputWrapper}>
        <SearchIcon size={18} color="#8E8E93" />
        <TextInput
          value={local}
          onChangeText={setLocal}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          style={styles.input}
          returnKeyType="search"
        />
      </View>
      <Pressable
        onPress={onOpenFilters}
        style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.8 }]}
        accessibilityRole="button"
        accessibilityLabel="Open filters"
      >
        <Text style={styles.filterText}>⋯</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
    marginLeft: 6,
  },
  filterBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: { color: '#1FB673', fontWeight: '700' },
});
