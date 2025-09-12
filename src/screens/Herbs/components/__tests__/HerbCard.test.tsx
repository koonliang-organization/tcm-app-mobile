import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import type { Herb } from '@/data/herbs';
import { HerbCard } from '../HerbCard';

describe('HerbCard', () => {
  const mockOnPress = jest.fn();

  const basicHerb: Herb = {
    id: '1',
    nameZh: '艾叶',
    namePinyin: 'AI YE',
  };

  const completeHerb: Herb = {
    id: '2',
    nameZh: '白术',
    namePinyin: 'BAI ZHU',
    family: 'Compositae',
    familyZh: '菊科',
    property: '温',
    flavor: ['苦', '辛'],
    meridians: ['脾经', '胃经'],
    indications: ['健脾益气', '燥湿利水'],
    appearance: '表面灰黄色或灰棕色',
    formulas: ['四君子汤', '参苓白术散'],
    sourceUrl: 'https://example.com/bai-zhu',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic herb information', () => {
    render(<HerbCard herb={basicHerb} onPress={mockOnPress} />);
    
    expect(screen.getByText('艾叶')).toBeTruthy();
    expect(screen.getByText('AI YE')).toBeTruthy();
  });

  it('renders complete herb information', () => {
    render(<HerbCard herb={completeHerb} onPress={mockOnPress} />);
    
    // Basic info
    expect(screen.getByText('白术')).toBeTruthy();
    expect(screen.getByText('BAI ZHU')).toBeTruthy();
    
    // Family info
    expect(screen.getByText('Compositae · 菊科')).toBeTruthy();
    
    // Property and flavor tags
    expect(screen.getByText('温')).toBeTruthy();
    expect(screen.getByText('苦')).toBeTruthy();
    expect(screen.getByText('辛')).toBeTruthy();
    
    // Meridians
    expect(screen.getByText('Meridians: 脾经, 胃经')).toBeTruthy();
    
    // Indications
    expect(screen.getByText('Indications: 健脾益气 • 燥湿利水')).toBeTruthy();
    
    // Appearance
    expect(screen.getByText('Appearance: 表面灰黄色或灰棕色')).toBeTruthy();
    
    // Formulas count
    expect(screen.getByText('Formulas: 2')).toBeTruthy();
    
    // Source link
    expect(screen.getByText('Source')).toBeTruthy();
  });

  it('handles missing optional fields gracefully', () => {
    const partialHerb: Herb = {
      id: '3',
      nameZh: '当归',
      namePinyin: 'DANG GUI',
      property: '温',
    };
    
    render(<HerbCard herb={partialHerb} onPress={mockOnPress} />);
    
    expect(screen.getByText('当归')).toBeTruthy();
    expect(screen.getByText('DANG GUI')).toBeTruthy();
    expect(screen.getByText('温')).toBeTruthy();
    
    // Should not show family info
    expect(screen.queryByText(/Compositae/)).toBeFalsy();
    
    // Should not show meridians, indications, appearance, formulas, or source
    expect(screen.queryByText(/Meridians:/)).toBeFalsy();
    expect(screen.queryByText(/Indications:/)).toBeFalsy();
    expect(screen.queryByText(/Appearance:/)).toBeFalsy();
    expect(screen.queryByText(/Formulas:/)).toBeFalsy();
    expect(screen.queryByText('Source')).toBeFalsy();
  });

  it('renders family info when only family is provided', () => {
    const herbWithFamily: Herb = {
      id: '4',
      nameZh: '人参',
      namePinyin: 'REN SHEN',
      family: 'Araliaceae',
    };
    
    render(<HerbCard herb={herbWithFamily} onPress={mockOnPress} />);
    
    expect(screen.getByText('Araliaceae')).toBeTruthy();
  });

  it('renders family info when only familyZh is provided', () => {
    const herbWithFamilyZh: Herb = {
      id: '5',
      nameZh: '黄芪',
      namePinyin: 'HUANG QI',
      familyZh: '豆科',
    };
    
    render(<HerbCard herb={herbWithFamilyZh} onPress={mockOnPress} />);
    
    expect(screen.getByText('豆科')).toBeTruthy();
  });

  it('renders single flavor correctly', () => {
    const herbWithSingleFlavor: Herb = {
      id: '6',
      nameZh: '甘草',
      namePinyin: 'GAN CAO',
      flavor: ['甘'],
    };
    
    render(<HerbCard herb={herbWithSingleFlavor} onPress={mockOnPress} />);
    
    expect(screen.getByText('甘')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    render(<HerbCard herb={basicHerb} onPress={mockOnPress} />);
    
    const card = screen.getByLabelText('Herb 艾叶');
    fireEvent.press(card);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(basicHerb);
  });

  it('works without onPress callback', () => {
    render(<HerbCard herb={basicHerb} />);
    
    const card = screen.getByLabelText('Herb 艾叶');
    // Should not crash when pressed without onPress
    fireEvent.press(card);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<HerbCard herb={basicHerb} onPress={mockOnPress} />);
    
    const card = screen.getByLabelText('Herb 艾叶');
    expect(card).toBeTruthy();
  });

  it('has proper accessibility for source link', () => {
    render(<HerbCard herb={completeHerb} onPress={mockOnPress} />);
    
    const sourceLink = screen.getByLabelText('Open source for 白术');
    expect(sourceLink).toBeTruthy();
  });

  it('renders empty arrays gracefully', () => {
    const herbWithEmptyArrays: Herb = {
      id: '7',
      nameZh: '附子',
      namePinyin: 'FU ZI',
      flavor: [],
      meridians: [],
      indications: [],
      formulas: [],
    };
    
    render(<HerbCard herb={herbWithEmptyArrays} onPress={mockOnPress} />);
    
    expect(screen.getByText('附子')).toBeTruthy();
    expect(screen.getByText('FU ZI')).toBeTruthy();
    
    // Empty arrays should not render their sections
    expect(screen.queryByText(/Meridians:/)).toBeFalsy();
    expect(screen.queryByText(/Indications:/)).toBeFalsy();
    expect(screen.queryByText(/Formulas:/)).toBeFalsy();
  });
});