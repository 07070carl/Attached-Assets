# Hangout Alley Siargao - Restaurant Management System

## Overview

Full-stack restaurant management and customer experience system for Hangout Alley Siargao, a garden-style island restaurant in Dapa, Surigao del Norte.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite + TailwindCSS v4 + shadcn/ui
- **Routing**: Wouter
- **Data fetching**: TanStack React Query (via generated hooks)
- **Charts**: Recharts
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

### Frontend (`artifacts/hangout-alley/`)

**Public pages:**
- `/` — Landing page with hero, featured dishes, reviews, about
- `/menu` — Full digital menu with category filters
- `/reserve` — Table reservation booking
- `/order` — Online ordering (dine-in/takeout) with cart
- `/reviews` — Customer reviews + submit new review

**Admin pages (`/admin/*`):**
- `/admin` — Dashboard with KPIs, recent activity, customer satisfaction
- `/admin/orders` — Real-time order management, status updates
- `/admin/reservations` — Reservation management
- `/admin/menu` — Menu item CRUD + categories management
- `/admin/inventory` — Stock tracking with low-stock alerts
- `/admin/staff` — Staff management
- `/admin/reviews` — Review moderation
- `/admin/analytics` — Sales charts, top dishes, revenue reporting

### Backend (`artifacts/api-server/`)

Express 5 REST API under `/api` prefix. Routes:
- `/api/categories` — Menu categories CRUD
- `/api/menu` — Menu items CRUD + featured items
- `/api/tables` — Restaurant table management
- `/api/orders` — Order creation and status management
- `/api/reservations` — Reservation booking and status management
- `/api/reviews` — Customer reviews
- `/api/inventory` — Inventory tracking
- `/api/staff` — Staff management
- `/api/analytics/*` — Dashboard summary, sales reports, top dishes, recent activity

### Database (`lib/db/`)

PostgreSQL with Drizzle ORM. Tables:
- `categories` — Menu categories
- `menu_items` — Food/drink menu with pricing and availability
- `tables` — Restaurant seating layout
- `orders` + `order_items` — Customer orders
- `reservations` — Table reservations
- `reviews` — Customer feedback and ratings
- `inventory` — Ingredient/supply tracking
- `staff` — Staff roster

## Codegen Fix

After running `pnpm --filter @workspace/api-spec run codegen`, the script automatically fixes `lib/api-zod/src/index.ts` to only export from `./generated/api` (orval generates conflicting barrel exports that are patched by the codegen script).
