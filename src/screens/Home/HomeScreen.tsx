import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/Button';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Welcome 🎉</Text>
      <Button title="Tap me" onPress={() => {}} />
    </View>
  );
}

