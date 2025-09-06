import * as AuthService from '@/services/authService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import LoginScreen from '../login';

const mockReplace = jest.fn();

jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    useRouter: () => ({ replace: mockReplace }),
    Redirect: ({ href }: { href: string }) => null,
    Link: ({ children }: { children: React.ReactNode }) => children as any,
  };
});

jest.mock('@/services/authService', () => {
  return {
    getCurrentUser: jest.fn(() => null),
    loginWithEmailPassword: jest.fn(),
    loginAnonymously: jest.fn(),
  };
});

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors for invalid email and short password', async () => {
    render(<LoginScreen />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.changeText(emailInput, 'invalid');
    fireEvent.changeText(passwordInput, 'short');

    expect(await screen.findByText(/enter a valid email/i)).toBeTruthy();
    expect(await screen.findByText(/min 8 characters/i)).toBeTruthy();
  });

  it('calls loginWithEmailPassword with trimmed email and navigates on success', async () => {
    const loginMock = jest.mocked(AuthService.loginWithEmailPassword);
    loginMock.mockResolvedValue({ id: 'u1', email: 'user@example.com', isAnonymous: false, token: 't' });

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByLabelText('Email'), '  user@example.com  ');
    fireEvent.changeText(screen.getByLabelText('Password'), 'pass1234');

    fireEvent.press(screen.getByRole('button', { name: /^Sign in$/ }));

    await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(1));
    expect(loginMock).toHaveBeenCalledWith('user@example.com', 'pass1234');
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  });

  it('prevents duplicate submit while loading', async () => {
    let resolveLogin: (v: any) => void;
    const pending = new Promise((res) => { resolveLogin = res; });
    jest.mocked(AuthService.loginWithEmailPassword).mockReturnValue(pending as any);

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'pass1234');

    // Cache the button before the label changes to "Signing in…"
    const signInButton = screen.getByRole('button', { name: /^Sign in$/ });
    // First tap triggers in-flight submit
    fireEvent.press(signInButton);
    // Second tap should be ignored while submitting
    fireEvent.press(signInButton);

    expect(AuthService.loginWithEmailPassword).toHaveBeenCalledTimes(1);

    // Resolve pending promise to let component finish
    // @ts-ignore - resolveLogin is definitely assigned in mock return setup
    resolveLogin!({ id: 'u1', email: 'user@example.com', isAnonymous: false, token: 't' });
  });

  it('anonymous path triggers loginAnonymously and navigates', async () => {
    jest.mocked(AuthService.loginAnonymously).mockResolvedValue({ id: 'g1', isAnonymous: true, token: 't' } as any);

    render(<LoginScreen />);

    fireEvent.press(screen.getByText(/continue as guest/i));

    await waitFor(() => expect(AuthService.loginAnonymously).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  });

  it('shows error message when sign-in fails and does not navigate', async () => {
    jest.mocked(AuthService.loginWithEmailPassword).mockRejectedValue(new Error('Invalid email or password'));

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'demo@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'wrongpass');

    fireEvent.press(screen.getByRole('button', { name: /^Sign in$/ }));

    expect(await screen.findByText(/invalid email or password/i)).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
