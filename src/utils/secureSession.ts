import * as SecureStore from 'expo-secure-store';
import { SESSION_KEY, setSessionRaw, getSessionRaw, clearSessionRaw } from '@/data/mockData';

export async function hydrateSessionFromSecureStore() {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (raw && !getSessionRaw()) {
      // Only hydrate if memory/local is empty to avoid overwriting newer data
      setSessionRaw(raw);
    }
  } catch (e) {
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

