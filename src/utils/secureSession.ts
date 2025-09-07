import { getSessionRaw, SESSION_KEY, setSessionRaw } from '@/data/mockUser';
import * as SecureStore from 'expo-secure-store';

export async function hydrateSessionFromSecureStore() {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (raw && !getSessionRaw()) {
      // Only hydrate if memory/local is empty to avoid overwriting newer data
      setSessionRaw(raw);
    }
  } catch {
    // no-op on web or if unavailable
  }
}

export async function persistSessionSecure() {
  try {
    const raw = getSessionRaw();
    if (raw != null) {
      await SecureStore.setItemAsync(SESSION_KEY, raw);
    }
  } catch {}
}

export async function clearSessionSecure() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {}
}

