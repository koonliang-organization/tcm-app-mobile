import React from 'react';
import { View, Text, Pressable } from 'react-native';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // In real apps, report to telemetry here
    console.warn('App error:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text accessibilityRole="header" style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Something went wrong</Text>
          <Text style={{ textAlign: 'center', color: '#555', marginBottom: 16 }}>
            An unexpected error occurred. You can try again.
          </Text>
          <Pressable accessibilityRole="button" onPress={this.reset} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#0a7ea4', borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

