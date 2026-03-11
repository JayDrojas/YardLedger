# YardLedger — Architecture & Rules

## Tech Stack

- Expo (React Native) + TypeScript
- Supabase (auth, Postgres, RLS, edge functions)
- WatermelonDB (offline-first local SQLite with sync)
- Redux Toolkit (state management)
- React Navigation v7 (native-stack + bottom-tabs)

## Layering (enforced order)

```
DB migration → Service → Store/Hook → Screen
```

**Never** call Supabase directly from screens or components. Always go through:

1. `services/` — raw Supabase queries, grouped by domain
2. `store/` — Redux slices for global state (auth, app sync status)
3. `hooks/` — React hooks that call services and manage loading/error state

## File Structure

```
src/
  components/     — Shared UI components
  config/         — Supabase client setup
  constants/      — Theme colors, spacing, font sizes
  db/             — WatermelonDB schema, models, sync
  hooks/          — Data fetching hooks (useMetals, useReceipts, etc.)
  lib/            — Barrel re-exports
  navigation/     — React Navigation navigators
  screens/        — Screen components (grouped by feature)
  services/       — Supabase data access (metals, receipts, inventory, sales, users)
  store/          — Redux Toolkit slices
  types/          — Shared TypeScript types
  utils/          — Pure utility functions
supabase/
  migrations/     — Postgres SQL migrations (sequential, timestamped)
  functions/      — Edge functions (Deno/TypeScript)
```

## Naming Conventions

- **Screens**: PascalCase (LoginScreen.tsx, InventoryScreen.tsx)
- **Services**: camelCase (metals.ts, receipts.ts)
- **Hooks**: camelCase with `use` prefix (useMetals.ts)
- **Store slices**: camelCase with `Store` suffix (authStore.ts)
- **DB models**: PascalCase (Receipt.ts, LineItem.ts)
- **Migrations**: `YYYYMMDDNNNNNN_snake_case.sql`

## Key Rules

- All Supabase queries live in `services/` — never in screens
- Load actions set `error` state; mutations throw
- All formatting utilities go in `utils/`
- Import from barrel exports where available (`services/index.ts`, `hooks/index.ts`)
- WatermelonDB models use decorators — `experimentalDecorators` is enabled
- Metals are dynamic (DB-managed) — never hardcode metal types
- Price overrides require admin auth and are tracked per line item
- Only admins can CRUD metals and change pricing

## Before Committing

- `npm run typecheck` — zero errors
- `npm run lint` — zero warnings
- `npm run format:check` — all files formatted
- Commit messages follow Conventional Commits (enforced by commitlint)
  - `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`

## Auth & Roles

- `admin` — can manage metals/pricing, see all receipts/sales, override prices
- `worker` — can create receipts, see own receipts, request price overrides (needs admin approval)
