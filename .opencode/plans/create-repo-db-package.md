# Plan: Create @repo/db Package

## Overview

Move all database-related code from `apps/web` to a shared `@repo/db` package that both web app and worker can use.

## Current State

### Database Files in apps/web:

```
apps/web/src/lib/db/
├── index.ts                    # Database connection with drizzle
└── schema/
    ├── index.ts                # Re-exports all schemas
    ├── auth.schema.ts          # Better Auth schema
    ├── form.schema.ts          # Form endpoints schema
    ├── notification.schema.ts  # Notification channels schema
    └── usage.schema.ts         # Usage tracking schema
```

### Worker Database (apps/worker/src/db.ts):

```typescript
import postgres from "postgres";
import { env } from "@repo/env/worker";
export const sql = postgres(env.DATABASE_URL);
```

## Proposed @repo/db Package Structure

```
packages/db/
├── package.json
├── tsconfig.json
├── drizzle.config.ts           # Moved from apps/web
├── src/
│   ├── index.ts                # Main export: db connection
│   ├── client.ts               # Alternative: raw postgres client (for worker)
│   └── schema/
│       ├── index.ts            # Re-exports all schemas
│       ├── auth.ts             # Renamed from auth.schema.ts
│       ├── forms.ts            # Renamed from form.schema.ts
│       ├── notifications.ts    # Renamed from notification.schema.ts
│       └── usage.ts            # Renamed from usage.schema.ts
└── drizzle/                    # Migrations directory (if exists)
```

## Package Configuration

### packages/db/package.json

```json
{
  "name": "@repo/db",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "scripts": {
    "db": "drizzle-kit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:check": "drizzle-kit check"
  },
  "dependencies": {
    "drizzle-orm": "catalog:",
    "postgres": "catalog:"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "@repo/env": "workspace:*",
    "@types/node": "catalog:",
    "drizzle-kit": "catalog:",
    "typescript": "catalog:"
  }
}
```

### packages/db/tsconfig.json

```json
{
  "extends": "@repo/config/tsconfig",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### packages/db/drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit";
import { env } from "@repo/env/server";

export default {
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
```

### packages/db/src/index.ts

```typescript
/**
 * Database connection for server-side usage.
 * Uses Drizzle ORM with postgres-js driver.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@repo/env/server";
import * as schema from "./schema";

// Connection for Drizzle ORM
const driver = postgres(env.DATABASE_URL);

export const db = drizzle({ client: driver, schema, casing: "snake_case" });

// Re-export schema for convenience
export * from "./schema";
```

### packages/db/src/client.ts

```typescript
/**
 * Raw postgres client for direct SQL queries.
 * Useful for worker or simple operations.
 */
import postgres from "postgres";
import { env } from "@repo/env/server";

export const sql = postgres(env.DATABASE_URL);
```

### packages/db/src/schema/index.ts

```typescript
export * from "./auth";
export * from "./forms";
export * from "./notifications";
export * from "./usage";
```

## Files to Move/Rename

1. **Move and rename schema files:**
   - `apps/web/src/lib/db/schema/auth.schema.ts` → `packages/db/src/schema/auth.ts`
   - `apps/web/src/lib/db/schema/form.schema.ts` → `packages/db/src/schema/forms.ts`
   - `apps/web/src/lib/db/schema/notification.schema.ts` → `packages/db/src/schema/notifications.ts`
   - `apps/web/src/lib/db/schema/usage.schema.ts` → `packages/db/src/schema/usage.ts`
   - `apps/web/src/lib/db/schema/index.ts` → `packages/db/src/schema/index.ts`

2. **Move drizzle config:**
   - `apps/web/drizzle.config.ts` → `packages/db/drizzle.config.ts`

3. **Delete old files:**
   - `apps/web/src/lib/db/index.ts`
   - `apps/worker/src/db.ts` (replaced by `@repo/db/client`)

## Import Updates Required

### In apps/web - Update all imports:

**From:**

```typescript
import { db } from "~/lib/db";
import { user } from "~/lib/db/schema";
import { form } from "~/lib/db/schema/form.schema";
```

**To:**

```typescript
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { form } from "@repo/db/schema/forms";
```

### In apps/worker - Replace db.ts:

**From:**

```typescript
import postgres from "postgres";
import { env } from "@repo/env/worker";
export const sql = postgres(env.DATABASE_URL);
```

**To:**

```typescript
import { sql } from "@repo/db/client";
```

## Apps Package.json Updates

### apps/web/package.json

Add dependency:

```json
"@repo/db": "workspace:*"
```

Update scripts (remove db commands, they're now in @repo/db):

```json
"scripts": {
  // Remove: "db": "drizzle-kit",
  // Add reference to workspace command if needed
}
```

### apps/worker/package.json

Add dependency:

```json
"@repo/db": "workspace:*"
```

Remove from dependencies:

```json
// Remove: "postgres": "^3.4.8"
```

## Root Package.json Scripts

Add convenient shortcuts:

```json
"scripts": {
  "db": "pnpm --filter @repo/db db",
  "db:generate": "pnpm --filter @repo/db db:generate",
  "db:migrate": "pnpm --filter @repo/db db:migrate",
  "db:push": "pnpm --filter @repo/db db:push",
  "db:studio": "pnpm --filter @repo/db db:studio"
}
```

## Catalog Updates

Add to `pnpm-workspace.yaml`:

```yaml
catalog:
  drizzle-orm: ^0.45.1
  drizzle-kit: ^0.31.8
  postgres: ^3.4.8
```

## Migration Steps

1. Create `packages/db/` directory structure
2. Copy all schema files (with .schema.ts → .ts rename)
3. Create package.json with exports configuration
4. Create tsconfig.json extending base config
5. Move drizzle.config.ts and update paths
6. Create src/index.ts (db connection)
7. Create src/client.ts (raw sql client)
8. Update apps/web/package.json to add @repo/db dependency
9. Update all imports in apps/web from `~/lib/db` to `@repo/db`
10. Update apps/worker to use `@repo/db/client`
11. Delete old db directories
12. Update root package.json with db scripts
13. Add new dependencies to catalog
14. Run pnpm install
15. Test both apps

## Questions

1. **Should we keep the `.schema.ts` suffix or rename to just `.ts`?**
   - Current: `auth.schema.ts`
   - Proposed: `auth.ts` (cleaner imports)

2. **Should the worker use drizzle-orm or keep raw postgres?**
   - Option A: Worker uses `@repo/db/client` (raw postgres)
   - Option B: Worker also uses `@repo/db` with full Drizzle ORM
   - Note: Worker currently does simple INSERTs, raw SQL might be more efficient

3. **Should we export types separately?**
   - Like: `import type { User } from "@repo/db/schema/auth"`

Please confirm these details before I execute!
