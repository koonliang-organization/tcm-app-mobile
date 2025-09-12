import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { AlphaIndexBar } from '../AlphaIndexBar';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, right: 0, bottom: 34, left: 0 }),
}));

describe('AlphaIndexBar', () => {
  const mockOnSelect = jest.fn();
  const testLetters = ['A', 'B', 'C', 'D', '#'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all provided letters', () => {
    render(<AlphaIndexBar letters={testLetters} onSelect={mockOnSelect} />);
    
    testLetters.forEach(letter => {
      expect(screen.getByText(letter)).toBeTruthy();
    });
  });

  it('calls onSelect with correct letter when pressed', () => {
    render(<AlphaIndexBar letters={testLetters} onSelect={mockOnSelect} />);
    
    const letterB = screen.getByText('B');
    fireEvent.press(letterB);
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('B');
  });

  it('calls onSelect for each letter when multiple letters are pressed', () => {
    render(<AlphaIndexBar letters={testLetters} onSelect={mockOnSelect} />);
    
    fireEvent.press(screen.getByText('A'));
    fireEvent.press(screen.getByText('C'));
    fireEvent.press(screen.getByText('#'));
    
    expect(mockOnSelect).toHaveBeenCalledTimes(3);
    expect(mockOnSelect).toHaveBeenNthCalledWith(1, 'A');
    expect(mockOnSelect).toHaveBeenNthCalledWith(2, 'C');
    expect(mockOnSelect).toHaveBeenNthCalledWith(3, '#');
  });

  it('has proper accessibility attributes', () => {
    render(<AlphaIndexBar letters={['A', 'B']} onSelect={mockOnSelect} />);
    
    // Check for accessibility labels that are set on the Pressable components
    const buttonA = screen.getByLabelText('Jump to A');
    const buttonB = screen.getByLabelText('Jump to B');
    
    expect(buttonA).toBeTruthy();
    expect(buttonB).toBeTruthy();
  });

  it('renders correctly with empty letters array', () => {
    render(<AlphaIndexBar letters={[]} onSelect={mockOnSelect} />);
    
    // Should not crash and should not have any letter buttons
    expect(screen.queryByText('A')).toBeFalsy();
    expect(screen.queryByText('B')).toBeFalsy();
    expect(screen.queryByText('#')).toBeFalsy();
  });

  it('handles special characters in letters array', () => {
    const specialLetters = ['#', '!', '@'];
    render(<AlphaIndexBar letters={specialLetters} onSelect={mockOnSelect} />);
    
    specialLetters.forEach(letter => {
      expect(screen.getByText(letter)).toBeTruthy();
    });
    
    fireEvent.press(screen.getByText('#'));
    expect(mockOnSelect).toHaveBeenCalledWith('#');
  });

  it('renders with proper styling structure', () => {
    render(<AlphaIndexBar letters={['A']} onSelect={mockOnSelect} />);
    
    // Check that letter is rendered and accessible
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByLabelText('Jump to A')).toBeTruthy();
  });
});