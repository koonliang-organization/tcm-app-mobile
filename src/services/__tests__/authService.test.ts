import { clearSessionRaw, ensureSeedUsers, saveUsers } from '@/data/mockData';
import {
  clearSession,
  getCurrentUser,
  loginAnonymously,
  loginWithEmailPassword,
  signOut,
  signUpWithEmailPassword,
} from '@/services/authService';

describe('authService', () => {
  beforeEach(() => {
    // Reset mock storage before each test
    saveUsers({});
    clearSessionRaw();
  });

  test('loginWithEmailPassword succeeds for seeded user', async () => {
    ensureSeedUsers();
    const user = await loginWithEmailPassword('demo@example.com', 'pass1234');
    expect(user).toBeDefined();
    expect(user.isAnonymous).toBe(false);
    expect(user.email).toBe('demo@example.com');
    expect(user.token).toEqual(expect.any(String));
    expect(getCurrentUser()).toEqual(user);
  });

  test('loginWithEmailPassword rejects on invalid credentials', async () => {
    ensureSeedUsers();
    await expect(loginWithEmailPassword('demo@example.com', 'wrong'))
      .rejects.toThrow(/invalid email or password/i);
  });

  test('signUpWithEmailPassword creates account and prevents duplicates', async () => {
    const email = 'newuser@example.com';
    const user = await signUpWithEmailPassword(email, 'pass1234');
    expect(user.email).toBe(email);
    expect(user.isAnonymous).toBe(false);
    expect(getCurrentUser()).toEqual(user);

    await expect(signUpWithEmailPassword(email, 'pass1234')).rejects.toThrow(/already in use/i);
  });

  test('loginAnonymously returns anonymous user', async () => {
    const anon = await loginAnonymously();
    expect(anon.isAnonymous).toBe(true);
    expect(anon.email).toBeUndefined();
    expect(getCurrentUser()).toEqual(anon);
  });

  test('signOut clears session', async () => {
    const user = await signUpWithEmailPassword('u1@example.com', 'pass1234');
    expect(getCurrentUser()).toEqual(user);
    await signOut();
    expect(getCurrentUser()).toBeNull();
    // Extra safety: clearSession is idempotent
    clearSession();
    expect(getCurrentUser()).toBeNull();
  });
});

