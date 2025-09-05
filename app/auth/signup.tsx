import React, { useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { signUpWithEmailPassword } from '@/services/authService';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return undefined;
    const ok = /.+@.+\..+/.test(email);
    return ok ? undefined : 'Enter a valid email';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return undefined;
    return password.length >= 8 ? undefined : 'Min 8 characters';
  }, [password]);

  const canSubmit = email.length > 0 && password.length > 0 && !emailError && !passwordError && !submitting;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await signUpWithEmailPassword(email.trim(), password);
      router.replace('/');
    } catch (e: any) {
      setFormError(e?.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
      <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 8 }}>
        Create account
      </Text>
      {!!formError && (
        <View accessibilityLiveRegion="polite" style={{ backgroundColor: '#fdecea', borderColor: '#f5c2c0', borderWidth: 1, padding: 10, borderRadius: 8 }}>
          <Text style={{ color: '#b00020' }}>{formError}</Text>
        </View>
      )}

      <View style={{ gap: 6 }}>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" placeholder="you@example.com" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }} />
        {!!emailError && <Text style={{ color: '#c00' }}>{emailError}</Text>}
      </View>
      <View style={{ gap: 6 }}>
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} autoCapitalize="none" autoComplete="password" secureTextEntry placeholder="••••••••" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }} />
        {!!passwordError && <Text style={{ color: '#c00' }}>{passwordError}</Text>}
      </View>
      <Button title={submitting ? 'Creating…' : 'Sign up'} onPress={handleSignUp} style={{ opacity: canSubmit ? 1 : 0.6 }} />
    </View>
  );
}
