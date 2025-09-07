import type { AuthSession, AuthUser } from '@/types/auth';
import {
  loadUsers,
  saveUsers,
  getSessionRaw,
  setSessionRaw,
  clearSessionRaw,
  type UserRecord,
} from '@/data/mockUser';
import { persistSessionSecure, clearSessionSecure } from '@/utils/secureSession';

function randomId(len = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[(Math.random() * chars.length) | 0];
  return out;
}

function makeToken() {
  return `${randomId(8)}.${randomId(12)}.${randomId(16)}`;
}

function delay(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function loginWithEmailPassword(email: string, password: string): Promise<AuthUser> {
  await delay();
  const db = loadUsers();
  const rec = db[email.toLowerCase()];
  if (!rec || rec.password !== password) {
    throw new Error('Invalid email or password');
  }
  const user: AuthUser = { id: rec.id, email: rec.email, isAnonymous: false, token: makeToken() };
  saveSession({ user });
  return user;
}

export async function signUpWithEmailPassword(email: string, password: string): Promise<AuthUser> {
  await delay();
  const db = loadUsers();
  const key = email.toLowerCase();
  if (db[key]) {
    throw new Error('Email already in use');
  }
  const rec: UserRecord = { id: randomId(), email, password };
  db[key] = rec;
  saveUsers(db);
  const user: AuthUser = { id: rec.id, email: rec.email, isAnonymous: false, token: makeToken() };
  saveSession({ user });
  return user;
}

export async function loginAnonymously(): Promise<AuthUser> {
  await delay(250);
  const user: AuthUser = { id: randomId(), isAnonymous: true, token: makeToken() };
  saveSession({ user });
  return user;
}

export async function signOut(): Promise<void> {
  await delay(150);
  clearSession();
}

export function saveSession(session: AuthSession) {
  setSessionRaw(JSON.stringify(session));
  // Persist securely on native platforms (no-op on web)
  void persistSessionSecure();
}

export function loadSession(): AuthSession {
  const raw = getSessionRaw();
  if (!raw) return { user: null };
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed && typeof parsed === 'object' ? parsed : { user: null };
  } catch {
    return { user: null };
  }
}

export function clearSession() {
  clearSessionRaw();
  void clearSessionSecure();
}

export function getCurrentUser(): AuthUser | null {
  return loadSession().user;
}
