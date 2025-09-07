import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

type IconProps = { size?: number; color?: string; strokeWidth?: number };
const S = 24;

export function HomeIcon({ size = S, color = '#8E8E93', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5L12 4l9 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M5 10.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export function UploadIcon({ size = S, color = '#8E8E93', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 16V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M8 8l4-4 4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 20h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ScanIcon({ size = S, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M20 8V6a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M4 16v2a2 2 0 0 0 2 2h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M20 16v2a2 2 0 0 1-2 2h-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Rect x="8" y="8" width="8" height="8" rx="2" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function BellIcon({ size = S, color = '#8E8E93', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.5 20a2.5 2.5 0 004.999 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileIcon({ size = S, color = '#8E8E93', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4 20c1.5-4 6-5 8-5s6.5 1 8 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 18, color = '#8E8E93', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M20 20l-3-3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

