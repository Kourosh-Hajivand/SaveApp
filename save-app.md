# save-app

Living project document for the **save-app** Expo / React Native client. Agents and contributors must keep this file current when shipping major features or milestones.

## Overview

| Item | Value |
|---|---|
| Package name | `save-app` |
| Platform | Expo SDK 57, React Native 0.86, Expo Router |
| Language | TypeScript (strict) |
| Styling | StyleSheet + NativeWind / design tokens in `src/constants/` |
| Server state | TanStack React Query |
| Client state | Zustand (`src/stores/`) |
| Forms | React Hook Form + Zod |
| Auth storage | Expo SecureStore |

This repo is the **mobile client**. There is no embedded SQL database in this app. Persistent secrets/tokens use SecureStore; catalog/home/product/search UI currently uses **mock data** until API services are wired.

## Agent rules (mandatory)

1. Always read this file (`save-app.md`) before writing any code.
2. After adding a major feature or completing a milestone, update this file.
3. Document the entire data/schema surface here (API models, client stores, SecureStore keys).
4. When migrations are introduced (backend-owned or local persistence), add them to the **Migrations** section below.

## Architecture

Layer order for API work:

```
api/routes → services → hooks → components
```

Feature folders under `src/features/`:

| Feature | Purpose |
|---|---|
| `auth` | Login / signup forms |
| `home` | Home screen: header, balance, categories, product sections |
| `product` | Product detail, hero gallery, image preview, cashback summary |
| `search` | Search route, input, result cards, client-side filter |

Route groups:

| Path | Role |
|---|---|
| `/` | Redirects to `/(main)` |
| `/(main)` | Home |
| `/(main)/search` | Search |
| `/(main)/product/[id]` | Product detail (`promoted=1` for hot-offer variant) |
| `/(auth)/*` | Auth flow (login-signup, OTP, forgot/reset password) |

Navigation notes:

- Profile tab on home bottom nav → `/(auth)/auth`.
- Home search icon → `/(main)/search`.
- Product cards → `/(main)/product/[id]`.
- Product / Search header back uses native `Stack.Toolbar` + `Stack.Toolbar.Button` (SF Symbol `chevron.left` on iOS).

## Current milestones

### Done

- Auth UI (login/signup/forgot/reset/OTP) with Controlled inputs and SwiftUI buttons where applicable.
- Home screen from Melu Figma (header, balance card, categories, product sections, bottom nav).
- Product detail (normal + promoted/hot offer) with `Stack.Toolbar` actions (share, favorite).
- Full-screen image preview (swipe, pinch/double-tap zoom, drag-to-dismiss).
- Search screen with autofocus, clear, suggestions, empty state, and full-width result cards.
- Shared UI: `CashChip`, `ProductCard`, `GradientText`, `BottomNavBar`.

### Next / open

- Wire home/product/search to real API (replace mock `data.ts` / search index).
- Android toolbar icons for `Stack.Toolbar.Button` (image sources / Material Symbols).
- Recent search history (local persistence).
- Optional shared-element / zoom transition into image preview.

## Client data schema

There is **no SQL schema** in this client. Documented below are the domain models and persistence keys used by the app.

### Domain models (TypeScript)

#### `Product` (`src/features/home/types.ts`)

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable product id |
| `title` | `string` | Display title |
| `image` | `ImageSourcePropType` | Card / list image |
| `rating` | `number` | e.g. `4.3` |
| `count` | `number` | Engagement count |
| `countUnit` | `'orders' \| 'visit'` | Label unit |
| `cashBackPercent` | `number` | 0–100 |
| `cashOutPercent` | `number` | 0–100 |

#### `ProductSection`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `title` | `string` | |
| `products` | `Product[]` | |
| `promoted?` | `boolean` | Hot Offers styling |
| `moreLabel?` | `string` | e.g. "See 12 more" |

#### `Category`

| Field | Type |
|---|---|
| `id` | `string` |
| `label` | `string` |
| `icon` | `ImageSourcePropType` |

#### `BalanceSummary`

| Field | Type | Notes |
|---|---|---|
| `cashBack` | `number` | |
| `cashBackDelta` | `number` | Shown as `+N$` |
| `cashOut` | `number` | |

#### `ProductDetail` (`src/features/product/types.ts`)

Extends product concepts with:

| Field | Type | Notes |
|---|---|---|
| `images` | `ImageSourcePropType[]` | Hero gallery |
| `host` | `{ name, avatar }` | Hosted-by card |
| `offer?` | `{ endsInLabel }` | Promoted cash-back banner |
| `openingHours` | `{ label, time }[]` | |
| `story` | `string` | Our Story body |
| `otherOptions` | `Product[]` | Related carousel |

### SecureStore / storage keys

See `src/enums/StorageKeys.ts` for the canonical enum. Document new keys here when added.

| Key (conceptual) | Purpose |
|---|---|
| Auth session tokens | Managed via auth session store + SecureStore |

### Mock data sources (to replace with API)

| Source | File |
|---|---|
| Home catalog | `src/features/home/data.ts` |
| Product detail builder | `src/features/product/data.ts` → `getProductDetail(id, promoted?)` |
| Search index | `src/features/search/useProductSearch.ts` (derived from `homeSections`) |

## Migrations

> Frontend-only repo today. When a backend/database is introduced or this client gains a local DB (SQLite, etc.), list every migration here.

| Date | Name | Description |
|---|---|---|
| — | — | None yet |

## Conventions reminder

- Path alias: `@/`
- No hardcoded API paths outside `src/api/routes/`
- Query keys from `QueryKey` enum
- English-only code comments
- User-facing agent communication: Persian unless the user writes otherwise
- Do not commit unless explicitly asked

## Changelog (high level)

| When | Change |
|---|---|
| 2026-07 | Home, product detail, image preview, search, Stack.Toolbar back/actions |
| 2026-07 | Auth forms aligned; entry redirects to `/(main)` |
| 2026-07 | Created this living document + `.cursorrules` pointer |
