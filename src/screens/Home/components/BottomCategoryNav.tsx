import { BellIcon, HomeIcon, ProfileIcon, ScanIcon, UploadIcon } from '@/components/Icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTab } from '../HomeScreen';

type Props = {
  activeTab: MainTab;
  onSelectTab: (key: MainTab) => void;
  onSignOut?: () => void; // optional helper during development
};

const INACTIVE = '#8E8E93';
const ACTIVE = '#1FB673';
const BG = '#ffffff';

const BASE_TABS: { key: Exclude<MainTab, 'scan'>; label: string; icon: 'home'|'upload'|'bell'|'profile' }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'upload', label: 'Upload', icon: 'upload' },
  { key: 'notifications', label: 'Notification', icon: 'bell' },
  { key: 'profile', label: 'Profile', icon: 'profile' },
];

export function BottomCategoryNav({ activeTab, onSelectTab, onSignOut }: Props) {
  const insets = useSafeAreaInsets();
  // We offset the whole bar by the bottom inset, so only add a small internal padding here.
  const bottomPad = 10;

  return (
    <View pointerEvents="box-none" style={[styles.absolute, { bottom: insets.bottom }]}>
      <View style={[styles.container, { paddingBottom: bottomPad }]}
        accessibilityRole="tablist"
        accessibilityLabel="Bottom navigation"
      >
        <View style={styles.sideGroup}>
          {BASE_TABS.slice(0, 2).map((t) => {
            const active = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => onSelectTab(t.key)}
                style={({ pressed }) => [styles.tab, pressed && { opacity: 0.8 }]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t.label}
              >
                {t.icon === 'home' && <HomeIcon size={22} color={active ? ACTIVE : INACTIVE} />}
                {t.icon === 'upload' && <UploadIcon size={22} color={active ? ACTIVE : INACTIVE} />}
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Scan FAB */}
        <Pressable
          onPress={() => onSelectTab('scan')}
          accessibilityRole="button"
          accessibilityLabel="Scan"
          style={({ pressed }) => [styles.scanBtn, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <ScanIcon size={24} color={BG} />
        </Pressable>

        <View style={styles.sideGroup}>
          {BASE_TABS.slice(2).map((t) => {
            const active = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => onSelectTab(t.key)}
                style={({ pressed }) => [styles.tab, pressed && { opacity: 0.8 }]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t.label}
              >
                {t.icon === 'bell' && <BellIcon size={22} color={active ? ACTIVE : INACTIVE} />}
                {t.icon === 'profile' && <ProfileIcon size={22} color={active ? ACTIVE : INACTIVE} />}
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 6,
  },
  sideGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  tab: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  tabLabel: { color: INACTIVE, fontWeight: '600', fontSize: 11 },
  tabLabelActive: { color: ACTIVE },
  scanBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1FB673',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
  },
});
