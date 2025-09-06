# 02 – Homepage (Search + Category Navigation)

## Goal
Build the homepage that lets users quickly explore and search across the three core categories: Herbs, Recipes, and Formulas. The page provides a generic, cross‑category search at the top, optional filters, and a stickied bottom navigation for the three categories.

## Visual Reference
- screenshot for layout inspiration: `02_screenshot1.png`.
- Follow the general structure shown: prominent search bar, pill‑style category chips, results list/grid, and a bottom, always‑visible navigation area.

## UI Requirements
- Search Bar (top)
  - Placeholder: "Search Herbs, Recipes, Formulas"
  - Debounced input (≈250–300ms) to reduce re‑renders and API calls
  - Supports cross‑category search (returns mixed results)
  - Optional filter button (icon) opens a filter sheet/modal

- Category Chips (below search)
  - Chips: All (default), Herbs, Recipes, Formulas
  - Single‑select; updates the results feed to the selected category
  - Shows selected state (filled background) like the reference screenshot

- Results Area
  - When All is selected or a generic query is entered, show mixed results grouped by category sections (Herbs, Recipes, Formulas)
  - When a specific category is selected, show only that category
  - Use `FlatList` with proper keyExtractors and virtualization
  - Empty state with guidance when no results match

- Bottom Navigation (stickied)
  - A persistent component at the bottom of the screen
  - Three actions/tabs: Herbs, Recipes, Formulas
  - Tapping switches context to the respective category screens (or filters the homepage to that category if staying on a single screen)
  - Remains visible while scrolling content

## Behavior & Logic
- Cross‑Category Search
  - Query matches across entities (Herb names, Recipe titles, Formula names, and relevant metadata)
  - Sorting by relevance; secondary by popularity/recentness where available
  - If a category chip is selected, scope search to that category; otherwise search all

- Filters (Optional)
  - Start with a lightweight sheet/modal
  - Suggested filters (phase 1): category (redundant with chips), difficulty/prep time (for Recipes), herb type or properties (for Herbs), formulation type (for Formulas)
  - Persist last‑used filters for the session

- State Management
  - Local state + React hooks (`useState`, `useMemo`, `useCallback`)
  - Consider Context or a lightweight store (e.g., Zustand) if shared across screens later

- Performance
  - Debounce search input, memoize heavy lists, and use `React.memo` for result items
  - Use `getItemLayout` where feasible for long lists

## Accessibility
- Set `accessibilityLabel` and `accessibilityRole` on Search, Filter, Chips, and Nav buttons
- Ensure visible focus states and adequate contrast for selected chips

## Technical Notes
- Navigation: `@react-navigation/bottom-tabs` (or a custom stickied footer component if not using tabs yet)
- File layout (feature‑based, TS preferred):
  - `src/screens/Home/HomeScreen.tsx`
  - `src/screens/Home/components/CategoryChips.tsx`
  - `src/screens/Home/components/BottomCategoryNav.tsx`
  - `src/screens/Home/hooks/useSearch.ts`
  - `src/screens/Home/types.ts`

### UI Skeleton (illustrative)
```tsx
// HomeScreen.tsx (sketch)
function HomeScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all'|'herbs'|'recipes'|'formulas'>('all');
  const results = useSearch({ query, category });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search Herbs, Recipes, Formulas"
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <CategoryChips
        items={["All", "Herbs", "Recipes", "Formulas"]}
        selected={category}
        onSelect={setCategory}
      />

      <ResultsList results={results} category={category} />

      <BottomCategoryNav
        selected={category}
        onSelect={setCategory}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      />
    </SafeAreaView>
  );
}
```

## Acceptance Criteria
- A top search bar that searches across Herbs, Recipes, and Formulas
- Category chips (All, Herbs, Recipes, Formulas) update the visible results
- Optional filter entry point present (icon/button) that opens a sheet/modal
- Bottom navigation with Herbs, Recipes, and Formulas is stickied and interactive
- Results render efficiently and handle empty states
- Basic a11y labels exist for all interactive controls

## Nice‑to‑Have (Later)
- Recent searches and suggested queries
- Persist selected category and last filters between app launches
- Section headers with “See all” links for mixed results

## Out of Scope (for this task)
- Full backend integration and complex filter logic beyond the initial set
- Detailed visual polish beyond what’s needed to match the reference layout

---

Notes: Follow existing linting and TypeScript settings. Keep components functional with hooks, and prefer composition over large monolith components.
