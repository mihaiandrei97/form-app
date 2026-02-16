# AGENTS.md - AI Coding Agent Guidelines

This document provides essential context for AI coding agents working in this repository.

## Monorepo Structure

This is a pnpm workspace monorepo with the following structure:

```
form-app/
├── apps/
│   ├── web/              # TanStack Start web application
│   └── worker/           # Background job worker (pg-boss)
└── packages/
    ├── config/           # Shared TypeScript configuration
    ├── db/               # Database schema & Drizzle ORM
    └── env/              # Environment variables (@repo/env)
```

## Technology Stack

- **Framework**: TanStack Start (React 19 SSR)
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Base UI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Package Manager**: pnpm (workspace)
- **Build Tool**: Vite 8

## Workspace Commands

Run commands from the repository root:

```bash
# Web app (apps/web)
pnpm dev                    # Start web dev server on port 3000
pnpm build                  # Build web app for production
pnpm start                  # Run web production server
pnpm lint                   # Run ESLint on web app
pnpm format                 # Run Prettier on web app
pnpm check-types            # TypeScript type checking on web app
pnpm check                  # Run format + lint + check-types on web app
pnpm ui add <component>     # Add shadcn/ui component

# Database (packages/db)
pnpm db                     # Run drizzle-kit
pnpm db:generate            # Generate migrations
pnpm db:migrate             # Run migrations
pnpm db:push                # Push schema changes to database
pnpm db:studio              # Open Drizzle Studio GUI

# Worker app (apps/worker)
pnpm dev:worker             # Start worker in dev mode
pnpm build:worker           # Build worker
pnpm start:worker           # Run worker production build

# Filtered commands (run in specific app)
pnpm --filter @repo/web <cmd>     # Run command in web app
pnpm --filter @repo/worker <cmd>  # Run command in worker app
pnpm --filter @repo/db <cmd>      # Run command in db package
```

### Testing

No test framework configured. To add Vitest:

```bash
pnpm add -D vitest @testing-library/react @testing-library/dom jsdom
pnpm vitest run path/to/test.test.ts      # Run single test file
pnpm vitest run -t "test name pattern"    # Run by test name
```

## Code Style Guidelines

### Formatting (Prettier)

- 2 spaces indentation, double quotes, semicolons required
- LF line endings, max 90 chars, trailing commas always
- Imports auto-organized, Tailwind classes auto-sorted

### TypeScript

- Strict mode enabled - no implicit `any`
- Use path alias `~/` for imports from `src/` directory (within each app)
- Use `type` imports: `import type { User } from "~/lib/db/schema"`

### Naming Conventions

| Element          | Convention | Example                     |
| ---------------- | ---------- | --------------------------- |
| Components       | PascalCase | `SignInButton`              |
| Files            | kebab-case | `sign-in-button.tsx`        |
| Server functions | $-prefixed | `$getUser`, `$createPost`   |
| Database columns | snake_case | `created_at`, `user_id`     |
| Package names    | kebab-case | `@repo/web`, `@repo/worker` |

### React Patterns

```typescript
// Server functions - prefix with $
import { createServerFn } from "@tanstack/react-start";

export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  // server-side code
});

// Data fetching - use queryOptions
export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => $getUser(),
  });

// In component - use useSuspenseQuery
const { data: user } = useSuspenseQuery(userQueryOptions());
```

### Routing Patterns

File-based routing in `apps/web/src/routes/`:

- `__root.tsx` - Root layout with providers
- `index.tsx` - Page component for a route
- `route.tsx` - Layout wrapper (uses `<Outlet />`)
- `(group)/` - Route groups for shared layouts
- `api/` - API routes

Protected routes use `beforeLoad` for auth:

```typescript
export const Route = createFileRoute("/(authenticated)")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions());
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
});
```

### Database (Drizzle ORM)

Database schema and connection are in `@repo/db` package:

```typescript
// Import database connection and schema
import { db, user, form } from "@repo/db";

// Import just the schema types
import type { User } from "@repo/db/schema";
```

Schema files are in `packages/db/src/schema/`. Use snake_case for columns:

```typescript
export const post = pgTable("post", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});
```

### UI Components

Use shadcn/ui from `~/components/ui/`. Use `cn()` for conditional classes:

```typescript
import { cn } from "~/lib/utils";
<Button className={cn("w-full", isLoading && "opacity-50")} />
```

### Environment Variables

- Client vars need `VITE_` prefix
- Import from `~/env/client` or `~/env/server`
- All validated with Zod schemas
- Each app has its own `.env` file in its directory

### Error Handling

- Use `DefaultCatchBoundary` for route error boundaries
- Use `toast` from Sonner for notifications: `toast.success()`, `toast.error()`

## Project Structure

### Web App (`apps/web/`)

```
apps/web/
├── src/
│   ├── components/ui/        # shadcn/ui components
│   ├── env/                  # Environment variable schemas
│   ├── lib/
│   │   ├── auth/             # Better Auth config & utilities
│   │   └── utils.ts          # Utility functions (cn, etc.)
│   ├── routes/               # TanStack Router file-based routes
│   │   ├── api/              # API routes
│   │   ├── (auth-pages)/     # Login, signup pages
│   │   └── (authenticated)/  # Protected pages
│   ├── router.tsx            # Router configuration
│   ├── routeTree.gen.ts      # Auto-generated (DO NOT EDIT)
│   └── styles.css            # Global styles & CSS variables
├── public/                   # Static assets
├── .env                      # Environment variables
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Worker App (`apps/worker/`)

```
apps/worker/
├── src/
│   ├── index.ts              # Entry point
│   ├── db.ts                 # Database connection (uses @repo/db)
│   ├── env.ts                # Environment configuration
│   └── types.ts              # Type definitions
├── dist/                     # Build output
├── .env                      # Environment variables
├── Dockerfile
└── package.json
```

### Database Package (`packages/db/`)

```
packages/db/
├── src/
│   ├── index.ts              # Database connection export
│   ├── schema/
│   │   ├── index.ts          # Re-exports all schemas
│   │   ├── auth.schema.ts    # Better Auth schema
│   │   ├── form.schema.ts    # Form endpoints schema
│   │   ├── notification.schema.ts  # Notification channels schema
│   │   └── usage.schema.ts   # Usage tracking schema
│   └── client.ts             # Raw postgres client (optional)
├── drizzle/                  # Database migrations
├── drizzle.config.ts         # Drizzle Kit configuration
└── package.json
```

## Important Notes

- `routeTree.gen.ts` is auto-generated by TanStack Router - never edit manually
- Each app has its own `.env` file in its directory (`apps/web/.env`, `apps/worker/.env`)
- `drizzle/` contains generated migrations (in `packages/db/`)
- Database schema is in `@repo/db` package - update there, not in apps
- Run workspace commands from the repository root using pnpm filters
