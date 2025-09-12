import { useMemo } from 'react';
import { HERBS, type Herb } from '@/data/herbs';

export type Section = { title: string; data: Herb[] };

function normalizeLetter(s: string) {
  const c = (s || '').trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

export function useHerbsSections() {
  return useMemo(() => {
    const buckets: Record<string, Herb[]> = {};
    for (const h of HERBS) {
      const key = normalizeLetter(h.namePinyin || h.nameZh);
      (buckets[key] ||= []).push(h);
    }
    const letters = Object.keys(buckets).sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)));
    const sections: Section[] = letters.map((l) => ({
      title: l,
      data: buckets[l].slice().sort((a, b) => (a.namePinyin || a.nameZh).localeCompare(b.namePinyin || b.nameZh)),
    }));
    return { sections, letters };
  }, []);
}

