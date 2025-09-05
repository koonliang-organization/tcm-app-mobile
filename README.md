# Frontend (Expo) – Clean Starter

This is a clean Expo starter aligning to the structure in `frontend/AGENTS.md`.

## Structure

```
frontend/
├── App.tsx                 # Entry (re-exports src/App)
├── app.json                # Expo config
├── assets/                 # Icons & splash
├── src/
│   ├── App.tsx             # Theme + NavigationContainer
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.styles.ts
│   │       └── index.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   └── Home/
│   │       └── HomeScreen.tsx
│   ├── services/
│   │   └── api.ts
│   └── utils/
│       └── helpers.ts
└── tsconfig.json
```

## Run

1. Install dependencies
   - `npm install`
2. Start the app
   - `npx expo start`

Open on Android, iOS, or web from the Expo Dev tools.

## Notes
- Uses React Navigation (Bottom Tabs) instead of Expo Router.
- Path aliases: `@/*` → `src/*`, `@assets/*` → `assets/*`.
- Add additional features under `src/screens`, `src/components`, `src/services`, and `src/utils` as you build.
