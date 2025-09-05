import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Image, useColorScheme } from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { getCurrentUser, loginAnonymously, loginWithEmailPassword } from '@/services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const authed = !!getCurrentUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await loginWithEmailPassword(email.trim(), password);
      router.replace('/');
    } catch (e: any) {
      const msg = e?.message || 'Sign in failed';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      await loginAnonymously();
      router.replace('/');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      // Google sign-in wiring comes later
      router.replace('/');
    } finally {
      setSubmitting(false);
    }
  };

  if (authed) {
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
      <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 8 }}>
        Sign in
      </Text>

      {!!formError && (
        <View accessibilityLiveRegion="polite" style={{ backgroundColor: '#fdecea', borderColor: '#f5c2c0', borderWidth: 1, padding: 10, borderRadius: 8 }}>
          <Text style={{ color: '#b00020' }}>{formError}</Text>
        </View>
      )}

      <View accessibilityLabel="Email field" style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, color: '#333' }}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          accessible
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        {!!emailError && <Text style={{ color: '#c00' }}>{emailError}</Text>}
      </View>

      <View accessibilityLabel="Password field" style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, color: '#333' }}>Password</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            accessibilityLabel="Password"
            accessible
            autoCapitalize="none"
            autoComplete="password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, paddingRight: 44 }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            onPress={() => setShowPassword((s) => !s)}
            style={{ position: 'absolute', right: 8, top: 8, padding: 8 }}
          >
            <Text style={{ color: '#007AFF' }}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>
        {!!passwordError && <Text style={{ color: '#c00' }}>{passwordError}</Text>}
      </View>

      <Button
        title={submitting ? 'Signing in…' : 'Sign in'}
        onPress={handleSignIn}
        style={{ opacity: canSubmit ? 1 : 0.6 }}
        textStyle={{ fontWeight: '600' }}
      />

      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#777', marginVertical: 8 }}>or</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleGoogle}
        disabled={submitting}
        android_ripple={{ color: isDark ? '#2a2a2a' : '#e8eaed' }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed
            ? (isDark ? '#2a2a2a' : '#f1f3f4')
            : (isDark ? '#1f1f1f' : '#ffffff'),
          borderWidth: 1,
          borderColor: isDark ? '#3c4043' : '#dadce0',
          borderRadius: 8,
          height: 44,
          paddingHorizontal: 12,
          opacity: submitting ? 0.7 : 1,
        })}
      >
        <View style={{ position: 'absolute', left: 12 }}>
          <Image
            accessibilityIgnoresInvertColors
            source={require('../../assets/google/google_g.png')}
            style={{ width: 18, height: 18 }}
          />
        </View>
        <Text style={{ color: isDark ? '#e3e3e3' : '#3c4043', fontSize: 16, fontWeight: '500' }}>
          {submitting ? 'Signing in…' : 'Sign in with Google'}
        </Text>
      </Pressable>

      {submitting && (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator accessibilityLabel="Loading" />
        </View>
      )}

      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Link href="/auth/signup" accessibilityRole="link" style={{ color: '#007AFF', fontSize: 16 }}>
          Create account
        </Link>
      </View>

      <Pressable accessibilityRole="button" onPress={handleGuest} style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Text style={{ color: '#555' }}>Continue as guest</Text>
      </Pressable>
    </View>
  );
}
