import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { styles } from './Button.styles';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({ title, onPress, style, textStyle }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

