# TCM App – Mobile Requirements

This document defines the scope, architecture, data contracts, and acceptance criteria for the offline‑first TCM mobile app (Expo, iOS/Android). It aligns the mobile client with a backend that stores authoritative data in MySQL and an admin web portal. The mobile experience must be fast, usable offline, and support Chinese (Simplified/Traditional) with pinyin.

## 1) Scope & Principles

- Offline‑first: browsing, search, and detail views work without network.
- Fast: list scrolling at 60fps; search returns in <100ms P95 on 10k items.
- Accurate Chinese display: bundle fonts; support Simplified/Traditional and pinyin.
- Read‑only content vs user data separation: dataset is immutable; user customizations are local overlays that never get overwritten by content updates.
- Data pipeline first: mobile never talks directly to MySQL; it downloads versioned SQLite snapshots published from MySQL.

Non‑goals (MVP): clinical decision support, multi‑user collaboration, delta sync (server → device), and push notifications.

## 2) Platforms & Tech

- Client: Expo (managed), React Native, `expo-sqlite` (FTS5), `expo-image`, `expo-font`, `expo-file-system`.
- Backend (existing/adjacent): MySQL as the authoritative store; admin portal for CRUD and publishing;

## 3) High-Level Architecture

Authoritative flow (server‑side):

MySQL (Admin CRUD) → SQLite snapshot with FTS + indices → Zip + checksum → Publish manifest → Storage (CDN/object store)

Mobile flow (client‑side):

First‑run copy bundled DB (optional) → Check manifest → Download latest `.db.zip` → Verify checksum → Atomic install → Open read‑only content DB + separate user DB

Rationale: SQLite snapshots provide excellent on‑device performance, minimal memory use, and simple atomic updates. Avoids exposing MySQL or large JSON APIs to the app and decouples schema changes from app code.

## 4) Data Sources & Publishing

- Admin Portal: editors manage Herbs, Formulas, Recipes, Tags, Aliases, Images; releases are reviewed and then “Published”.
- Admin Publish Output (per release):
  - `tcm_v{X.Y.Z}.db` (SQLite, see schema outline below)
  - `tcm_v{X.Y.Z}.db.zip` (compressed)
  - `manifest.json` with fields:

```json
{
  "version": "1.0.0",
  "created_at": "2025-09-05T10:00:00Z",
  "size_bytes": 12345678,
  "checksum_sha256": "<hex>",
  "url": "https://cdn.example.com/datasets/tcm_v1.0.0.db.zip",
  "min_app_version": "1.0.0"
}
```

- Keep N previous versions for rollback (e.g., last 3 manifests).
- Optional: Ship a small snapshot (`assets/db/tcm.db`) with the app so first launch works offline; app still upgrades to the latest when online.

## 5) On‑Device Data Layout

Two databases in the app sandbox:

1) Content DB (read‑only): `tcm.db`
   - Built by Admin Portal. Opened read‑only. Replaced atomically on updates.
2) User DB (mutable): `user.db`
   - Contains favorites, notes, recents, and custom/overridden records.

Overlay model for customization:

- `custom_patch(entity, origin_id, patch_json, updated_at)` stores partial overrides for a base record (e.g., user note, preferred dosage text). `origin_id` refers to a row in the content DB by UUID.
- `custom_entity(entity, id, payload_json, created_at, updated_at)` stores fully user‑created herbs/formulas/recipes (no `origin_id`).
- Views in the app layer merge base + patch. If a base record is removed in a newer dataset, user patches remain and are flagged as orphaned.

## 6) Core Features (MVP)

- Browsing: virtualized lists for Herbs, Formulas, Recipes with category/tag filters.
- Detail screens: rich text, images, cross‑links (tap herb inside a formula to open it).
- Search: unified search across CN/EN/pinyin/aliases with ranking and filters.
- Favorites & Notes: stored locally; searchable; export/import JSON.
- Customization: per‑record notes and optional field overrides; create user records.
- Settings: Simplified/Traditional toggle, pinyin tones on/off, theme, data version, “Check for data update”, backup/restore.

## 7) Internationalization & Fonts

- Bundle CJK fonts (e.g., Noto Sans/Serif SC + TC) and a Latin font that supports pinyin tone marks; load via `expo-font`.
- Content fields: `name_cn_simp`, `name_cn_trad`, `name_pinyin`, `name_pinyin_notone`, `name_en`.
- UI: EN + CN initially; i18n structure prepared for other locales.

## 8) Search & Indexing

- Engine: SQLite FTS5 (`unicode61`, `remove_diacritics=2`).
- Precomputed search helpers in the Publish step (admin export):
  - Pinyin with and without tones, syllable‑joined and spaced.
  - Aliases table folded into FTS.
  - Chinese substring support via bigrams column or auxiliary indexed LIKE column.
- Ranking order: exact CN/alias > pinyin (no‑tone) > EN > body text; boost favorites and recency.
- Targets: <50ms query for ≤50 results; incremental search with debounce (150–250ms).

## 9) Data Model (SQLite Snapshot)

Entities (key fields shown; final schema defined in the admin portal's publish/export tooling):

- `herb(id UUID, name_cn_simp, name_cn_trad, name_pinyin, name_pinyin_notone, name_en, category_id, nature, flavor, channels, actions, indications, dosage, prep, contraindications, source, image_id, slug)`
- `formula(id UUID, name_cn_simp, name_cn_trad, name_pinyin, name_pinyin_notone, name_en, functions, indications, prep, contraindications, source, slug)`
- `recipe(id UUID, name_cn_simp, name_cn_trad, name_pinyin, name_pinyin_notone, name_en, instructions, notes, source, slug)`
- `herb_formula(herb_id, formula_id, grams, ratio, role)`
- `formula_recipe(formula_id, recipe_id)`
- `aka(id, entity, entity_id, alias_cn, alias_pinyin, alias_en)`
- `tag(id, name)` and `record_tag(entity, entity_id, tag_id)`
- `image(id, thumb_uri, full_uri, license)`
- `pattern(id, name_cn_simp, name_cn_trad, name_en, description)` (optional for later)
- FTS: `herb_fts`, `formula_fts`, `recipe_fts` (contentless or content=...) including CN/EN/pinyin/aliases and key text fields.
- `meta(key, value)` where `('data_version','X.Y.Z')`, `('build_time','ISO')`, `('min_app_version','X.Y.Z')`.

Indices on lookup keys and foreign keys; FTS tables and indexes are created during the publish/export step (snapshot is read‑only on device).

## 10) Dataset Download & Update Flow

- On first launch: if network available, call `GET /datasets/latest` to fetch manifest; otherwise, use bundled DB and schedule a background check.
- Download `.db.zip` to a temp file; verify `checksum_sha256` → unzip to temp path → swap into app data directory (`/SQLite/tcm.db`) in a single move; retain previous as backup until success.
- Show Data Version in Settings. Provide manual “Check for data update”.
- Update frequency: manual + automatic weekly (Wi‑Fi only, charging optional).
- Handle `min_app_version`: if app is too old, show blocking prompt to update app.

## 11) Backup & Restore (User Data)

- Optional account; auth via JWT; token stored in `expo-secure-store`.
- Backup payload: zipped `user.db` (or canonical JSON) with user ID and checksum.
- Endpoints:
  - `POST /user-backups` → upload backup; returns `{backup_id, created_at, checksum}`
  - `GET /user-backups/latest` → returns metadata + download URL
  - `GET /user-backups/{id}` → download selected backup
- Restore: download to temp, verify checksum, replace `user.db` atomically; rollback on failure.
- Privacy: no PII besides account identifiers; encrypted in transit and at rest.

## 12) API Contracts (Dataset)

- `GET /datasets/latest` → `manifest.json` as above.
- `GET /datasets/versions` → array of manifests (for rollback UI in admin or diagnostics).
- `GET /datasets/{version}.db.zip` → dataset file.
- Caching: long cache headers on versioned assets; short cache on `latest` manifest.

## 13) Performance Targets & Budgets

- Cold start: ≤2.5s mid‑tier Android; warm start ≤1.2s.
- Search query: ≤50ms P95 for ≤50 results; ≤120ms for complex filtered queries.
- Memory: avoid loading >200 visible rows; use `FlatList` with `getItemLayout`, memoized item renderers.
- Storage: base DB 100–300MB including thumbnails; warn on low disk space.

## 14) Security & Compliance

- No direct MySQL access from mobile. All downloads via HTTPS; checksums verified.
- Code updates via EAS Updates (optional). Data updates via dataset pipeline only.
- Display content disclaimer; app is an educational reference, not a medical device.

## 15) Accessibility

- Dynamic Type support; adequate line height for CJK scripts.
- High‑contrast light/dark themes; screen reader labels for list items and search controls.

## 16) Telemetry & Diagnostics (Optional)

- Opt‑in anonymous metrics: search count, update success/failure, screen usage. Store toggle in Settings.
- Crash/error reporting: Sentry (optional), ensuring no sensitive content is sent.

## 17) Acceptance Criteria (MVP)

- Offline‑first: full browse/search/detail in airplane mode after initial install.
- Search quality: typing any of 黄芪/黃芪/huangqi/huang qi/astragalus returns the same herb in top results.
- Performance: list scrolls smoothly on 10k items; search within 100ms P95 for common queries.
- Updates: dataset downloads, verifies, and hot‑swaps without corruption; previous version restored on failure.
- Customization: user notes/overrides persist across dataset updates and appear in detail/search.
- Backup/restore: user can back up to server and restore on another device.

## 18) Open Questions

- Images: bundle thumbnails vs fetch on demand? preferred thumbnail dimensions and formats.
- Licensing: confirm rights for offline distribution and attributions for sources/images.
- Accounts: email/password vs social login vs anonymous with restore code.
- Incremental updates: when to add deltas vs snapshot‑only; expected dataset churn.
- Web parity: whether a public web reference is planned (affects dataset design).

## 19) Appendix

- File naming: `tcm_v{X.Y.Z}.db`, zipped as `.db.zip`.
- Suggested IDs: UUIDv4 or ULID; stable across MySQL and snapshots.
- Recommended SQLite FTS: `fts5(..., tokenize = 'unicode61 remove_diacritics 2');`.
- Example `meta` rows:

```sql
INSERT INTO meta(key, value) VALUES
 ('data_version', '1.0.0'),
 ('build_time', '2025-09-05T10:00:00Z'),
 ('min_app_version', '1.0.0');
```

---

Decision summary:
- Admin WILL publish MySQL → SQLite snapshots; mobile downloads these (not MySQL direct).
- User customizations remain local by default; optional backup/restore to backend is supported.
- Two-DB approach (content vs user) isolates updates from user data and keeps performance high.
