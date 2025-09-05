import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { getCurrentUser, signOut } from '@/services/authService';
import { useToast } from '@/components/Toast/ToastProvider';

export default function HomeScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const { show } = useToast();

  const handleSignOut = async () => {
    await signOut();
    show('Signed out');
    router.replace('/auth/login');
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Welcome 🎉</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
        {user?.isAnonymous ? 'Signed in as Guest' : `Signed in as ${user?.email ?? 'User'}`}
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="Tap me" onPress={() => {}} />
        <Button title="Sign out" onPress={handleSignOut} />
      </View>
    </View>
  );
}
