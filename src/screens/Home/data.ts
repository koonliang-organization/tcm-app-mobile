export type Item = {
  id: string;
  title: string;
  subtitle: string;
  category: 'herbs' | 'recipes' | 'formulas' | 'acupuncture';
  color: string;
};

export const DATA: Item[] = [
  { id: 'h1', title: 'Ginseng', subtitle: 'Energy • Root', category: 'herbs', color: '#E9F7EF' },
  { id: 'h2', title: 'Chamomile', subtitle: 'Calming • Flower', category: 'herbs', color: '#FFF5E6' },
  { id: 'r1', title: 'Pancake', subtitle: 'Food • <60 mins', category: 'recipes', color: '#EAF2FF' },
  { id: 'r2', title: 'Salad', subtitle: 'Food • <30 mins', category: 'recipes', color: '#E6FFF2' },
  { id: 'f1', title: 'Digestive Mix', subtitle: 'Powder • Herbs', category: 'formulas', color: '#F8E6FF' },
  { id: 'f2', title: 'Sleep Tonic', subtitle: 'Tincture • Night', category: 'formulas', color: '#FFE6EF' },
  { id: 'a1', title: 'LI4 Hegu', subtitle: 'Hand • Analgesic', category: 'acupuncture', color: '#F0F9FF' },
  { id: 'a2', title: 'ST36 Zusanli', subtitle: 'Leg • Vitality', category: 'acupuncture', color: '#FFF0F6' },
];

export function countByCategory(items: Item[]) {
  return items.reduce(
    (acc, it) => {
      acc[it.category] = (acc[it.category] ?? 0) + 1;
      return acc;
    },
    { herbs: 0, recipes: 0, formulas: 0, acupuncture: 0 } as Record<Item['category'], number>
  );
}

