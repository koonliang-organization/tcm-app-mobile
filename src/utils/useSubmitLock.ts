import { useRef } from 'react';

// Prevents rapid duplicate submissions. Returns a function that
// acquires a time-based lock; it returns true when the action may proceed.
export function useSubmitLock(durationMs = 800) {
  const untilRef = useRef(0);
  return () => {
    const now = Date.now();
    if (now < untilRef.current) return false;
    untilRef.current = now + durationMs;
    return true;
  };
}

