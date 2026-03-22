# ---- Base ----
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Dependencies ----
FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY apps/web/package.json ./apps/web/
COPY apps/worker/package.json ./apps/worker/
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/

RUN pnpm install --frozen-lockfile

# ---- Source ----
FROM deps AS migrate
COPY packages/db ./packages/db

CMD ["pnpm", "--filter", "@repo/db", "db:migrate"]

# docker compose run --rm migrate
