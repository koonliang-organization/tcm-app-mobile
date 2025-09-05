import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
      <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 8 }}>
        Create account
      </Text>
      <View style={{ gap: 6 }}>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" placeholder="you@example.com" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }} />
      </View>
      <View style={{ gap: 6 }}>
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} autoCapitalize="none" autoComplete="password" secureTextEntry placeholder="••••••••" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }} />
      </View>
      <Button title="Sign up" onPress={() => router.replace('/')} />
    </View>
  );
}

