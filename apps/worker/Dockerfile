# ---- Base ----
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Dependencies ----
FROM base AS deps

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all workspace package.json files to resolve workspace dependencies
COPY apps/web/package.json ./apps/web/
COPY apps/worker/package.json ./apps/worker/
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/

RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM deps AS build

# Copy full source
COPY . .

# Build the worker (tsup bundles everything into dist/)
RUN pnpm --filter @repo/worker build

# ---- Runtime ----
FROM node:24-alpine AS runtime
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 app

# Copy the bundled worker output
COPY --from=build --chown=app:app /app/apps/worker/dist ./dist
COPY --from=build --chown=app:app /app/apps/worker/package.json ./

USER app

CMD ["node", "dist/index.js"]
