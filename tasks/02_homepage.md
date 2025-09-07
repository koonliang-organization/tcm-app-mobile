# 02 – Homepage (Search + Category Navigation)

## Goal
Build the homepage that lets users quickly explore and search across the three core categories: Herbs, Recipes, and Formulas. The page provides a generic, cross‑category search at the top, optional filters, and a stickied bottom navigation with five global actions: Home, Upload, Scan (center FAB), Notifications, and Profile (matching the reference screenshot).

## Visual Reference
- screenshot for layout inspiration: `02_screenshot1.png`.
- Follow the structure shown: prominent search bar, large category cards ("Category Boxes") with hero images, and a bottom, always‑visible navigation area.

## UI Requirements
- Search Bar (top)
  - Placeholder: "Search"
  - Debounced input (≈250–300ms) to reduce re‑renders and API calls
  - Optional filter button opens a sheet/modal
  - Visuals: rounded pill input with a left search icon and subtle light‑gray background; respects top safe‑area.

- Category Boxes (below search)
  - Cards for: Herbs, Recipes, Formulas, Acupuncture
  - Each card shows a large hero image (≈148px height), title, and an item count.
  - Rounded corners with no clipping: image uses only top radii; card uses `overflow: hidden`.
  - Subtle elevation/shadow to match the reference.
  - Selecting a card sets the active category (used for navigating or filtering in the next view).

- Results Area (vNext)
  - When a category is selected, show that category’s results (two‑column grid with image, title, meta). Existing `ResultsList` supports this.
  - Use `FlatList` with proper keyExtractors and virtualization; show an empty state when no results match.

- Bottom Navigation (stickied)
  - Persistent component at the bottom with five actions: Home, Upload, Scan (center FAB), Notifications, Profile.
  - Center Scan is a circular, raised FAB overlapping the bar slightly.
  - Icons and labels are slightly larger for readability: icons ≈24px (Scan ≈26px), labels ≈12px.
  - Honors device safe‑area insets; remains visible while scrolling content.

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
- Safe Area handling:
  - App is wrapped in `SafeAreaProvider`.
  - `HomeScreen` uses `SafeAreaView` from `react-native-safe-area-context` with `edges={['top','left','right']}`.
  - Content container adds `paddingBottom: insets.bottom + 96` to avoid overlap with the bottom bar.
  - `BottomCategoryNav` positions with `bottom: insets.bottom` and a small internal `paddingBottom: 10`.
- Navigation: `@react-navigation/bottom-tabs` (or a custom stickied footer component if not using tabs yet)
- For the center Scan button, use a custom `tabBarButton` (if using bottom‑tabs) or render a small FAB above the bar with safe‑area padding
- File layout (feature‑based, TS preferred):
  - `src/screens/Home/HomeScreen.tsx`
  - `src/screens/Home/components/CategoryBoxes.tsx`
  - `src/screens/Home/components/BottomCategoryNav.tsx` (Home, Upload, Scan, Notifications, Profile)
  - `src/screens/Home/hooks/useSearch.ts`
  - `src/screens/Home/types.ts`

### UI Skeleton (illustrative)
```tsx
// HomeScreen.tsx (sketch)
function HomeScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all'|'herbs'|'recipes'|'formulas'>('all');
  const [activeTab, setActiveTab] = useState<'home'|'upload'|'scan'|'notifications'|'profile'>('home');
  const results = useSearch({ query, category });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search"
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <CategoryChips
        items={["All", "Herbs", "Recipes", "Formulas"]}
        selected={category}
        onSelect={setCategory}
      />

      <ResultsList results={results} category={category} />

      <BottomCategoryNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      />
    </SafeAreaView>
  );
}
```

## Acceptance Criteria
- A top search bar with debounce and a filter entry point
- Category Boxes for Herbs, Recipes, Formulas, Acupuncture with large hero images and item counts; no image clipping at rounded corners
- Tapping a Category Box selects that category (and navigates/filters as appropriate)
- Bottom navigation includes: Home, Upload, Scan (center FAB), Notifications, Profile; is stickied, respects safe‑areas, and uses slightly larger icons/labels
- Results (when shown) render efficiently and handle empty states
- Basic a11y labels exist for all interactive controls

## Screenshot QA Checklist
- Search Bar: pill shape with left search icon; placeholder is `Search`; subtle light‑gray background; respects top safe‑area.
- Category Section: vertical stack of Category Boxes; each has a large hero image with only the top corners rounded; no clipping; subtle shadow/elevation.
- Results Grid (when shown): two‑column cards with image, title, and small meta row; optional heart overlay; consistent gutters and rounded corners.
- Scrolling: content respects safe‑areas; bottom navigation remains visible while scrolling and does not overlap card content.
- Bottom Navigation: five items (Home, Upload, Scan center FAB, Notifications, Profile) left→right; center Scan is raised circular button; active item tinted green; inactive items gray; thin top border on bar; honors bottom safe‑area; icons ≈24/26px; labels ≈12px.
- Interaction States: press feedback on buttons; nav uses tab roles with selected state; search, filter, chips, and nav have accessibility labels.
- Device Fit: layout holds on common iPhone/Android sizes (e.g., 390×844 and smaller); no truncation or overlap at notches and home indicator.

## Nice‑to‑Have (Later)
- Recent searches and suggested queries
- Persist selected category and last filters between app launches
- Section headers with “See all” links for mixed results

## Out of Scope (for this task)
- Full backend integration and complex filter logic beyond the initial set
- Detailed visual polish beyond what’s needed to match the reference layout

---

Notes: Follow existing linting and TypeScript settings. Keep components functional with hooks, and prefer composition over large monolith components.
