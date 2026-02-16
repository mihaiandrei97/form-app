# Plan: Create @repo/config and @repo/env packages

## Overview

Create two foundational packages to share TypeScript configuration and environment variables across the monorepo.

## Package 1: @repo/config

### Purpose

Shared TypeScript configuration that can be extended by all apps and packages.

### Structure

```
packages/config/
├── package.json
└── tsconfig.base.json
```

### Files

**packages/config/package.json:**

```json
{
  "name": "@repo/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./tsconfig": "./tsconfig.base.json"
  }
}
```

**packages/config/tsconfig.base.json:**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "verbatimModuleSyntax": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["node"]
  }
}
```

## Package 2: @repo/env

### Purpose

Centralized environment variable validation using @t3-oss/env-core with Zod schemas.

### Structure

```
packages/env/
├── package.json
├── src/
│   ├── server.ts    # Server-side env vars (process.env)
│   └── web.ts       # Web/client env vars (VITE_ prefix, import.meta.env)
└── tsconfig.json
```

### Dependencies

Will use pnpm catalogs for version management.

**packages/env/package.json:**

```json
{
  "name": "@repo/env",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./server": "./src/server.ts",
    "./web": "./src/web.ts"
  },
  "dependencies": {
    "@t3-oss/env-core": "catalog:",
    "dotenv": "catalog:",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@repo/config": "workspace:*",
    "@types/node": "catalog:",
    "typescript": "catalog:"
  }
}
```

**packages/env/tsconfig.json:**

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

### Source Files

**packages/env/src/server.ts:**

- Server-side environment variables (used by web server and worker)
- Uses `process.env`
- Includes: DATABASE_URL, BETTER_AUTH_SECRET, OAuth configs, Creem configs

**packages/env/src/web.ts:**

- Client-side environment variables (used by web app frontend)
- Uses `import.meta.env` with VITE\_ prefix
- Includes: VITE_BASE_URL

## Files to Update

### 1. Root pnpm-workspace.yaml

Add packages directory:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2. Root package.json (add pnpm catalog)

Add catalog section for centralized dependency versions:

```json
{
  "pnpm": {
    "catalog": {
      "@t3-oss/env-core": "^0.13.10",
      "@types/node": "^24.10.4",
      "dotenv": "^16.4.7",
      "typescript": "^5.9.3",
      "zod": "^4.3.5"
    }
  }
}
```

### 3. apps/web/tsconfig.json

Extend base config and add app-specific settings:

```json
{
  "extends": "@repo/config/tsconfig",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "paths": {
      "~/*": ["./src/*"]
    },
    "noEmit": true
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

### 4. apps/worker/tsconfig.json

Extend base config and add worker-specific settings:

```json
{
  "extends": "@repo/config/tsconfig",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. apps/web - Update imports

Replace:

```typescript
// From:
import { env } from "~/env/server";
import { env } from "~/env/client";

// To:
import { env } from "@repo/env/server";
import { env } from "@repo/env/web";
```

### 6. apps/worker - Update imports

Replace:

```typescript
// From:
import "./env";
import { env } from "./env";

// To:
import "@repo/env/server";
import { env } from "@repo/env/server";
```

## Steps

1. Create `packages/config/` directory with package.json and tsconfig.base.json
2. Create `packages/env/` directory with package.json, tsconfig.json, and src/
3. Update root package.json with pnpm catalog
4. Update apps/web/tsconfig.json to extend base config
5. Update apps/worker/tsconfig.json to extend base config
6. Create packages/env/src/server.ts with server env schema
7. Create packages/env/src/web.ts with client env schema
8. Update apps/web to use @repo/env imports
9. Update apps/worker to use @repo/env imports
10. Delete old env files in apps
11. Run pnpm install and verify builds

## Open Questions

1. **Should server.ts include both web server and worker env vars, or should we have separate files?**
   - Current plan: Single server.ts with all server vars
   - Alternative: server.ts (web) and worker.ts (worker)

2. **Should we merge the env schemas or keep them separate?**
   - Web server needs: DATABASE_URL, BETTER_AUTH_SECRET, OAuth, Creem
   - Worker needs: DATABASE_URL, RESEND_API_KEY, job config
   - Shared: DATABASE_URL

3. **What about the worker's specific env handling (optionalIntEnv, etc.)?**
   - Should this utility be in @repo/env too?
   - Or keep it app-specific?

Please review and let me know your preferences on these questions!
