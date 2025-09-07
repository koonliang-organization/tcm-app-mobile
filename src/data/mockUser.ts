// Mock data and storage helpers used by the auth service

export type UserRecord = {
  id: string;
  email: string;
  password: string; // mock-only
};

export type UsersDB = Record<string, UserRecord>; // email -> record

// Simple storage wrapper: uses localStorage on web, falls back to in-memory elsewhere
const memoryStore: Record<string, string | null> = {};

export const storage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
  },
  setItem(key: string, value: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {}
    memoryStore[key] = value;
  },
  removeItem(key: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {}
    delete memoryStore[key];
  },
};

export const USERS_KEY = 'mock_auth_users_v1';
export const SESSION_KEY = 'mock_auth_session_v1';

export function loadUsers(): UsersDB {
  const raw = storage.getItem(USERS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as UsersDB;
  } catch {
    return {};
  }
}

export function saveUsers(db: UsersDB) {
  storage.setItem(USERS_KEY, JSON.stringify(db));
}

// Session raw helpers (stringified JSON handled by service layer)
export function getSessionRaw(): string | null {
  return storage.getItem(SESSION_KEY);
}

export function setSessionRaw(value: string) {
  storage.setItem(SESSION_KEY, value);
}

export function clearSessionRaw() {
  storage.removeItem(SESSION_KEY);
}

// Seed a default demo user for local development
function randomId(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[(Math.random() * chars.length) | 0];
  return out;
}

export function ensureSeedUsers() {
  const db = loadUsers();
  const email = 'demo@example.com';
  const key = email.toLowerCase();
  if (!db[key]) {
    db[key] = { id: randomId(), email, password: 'pass1234' };
    saveUsers(db);
  }
}

