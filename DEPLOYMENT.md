# Deployment Guide

## Architecture

A single `docker-compose.yml` at the root manages all services.

| Service | Purpose |
|---------|---------|
| `postgres` | Database (internal to this compose file) |
| `worker` | Background job worker (pg-boss) |
| `web` | TanStack Start web application |

Networks:

| Network | Who joins | Purpose |
|---------|-----------|---------|
| `caddy-net` | Caddy (external), Web | Reverse proxy to app — **external, created once per VM** |
| `form-app-postgres-net` | Postgres, Web, Worker | Database access — **internal, managed by compose** |

## First-Time Deployment

### 1. Prerequisites

SSH into your VM and install Docker:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

### 2. Clone the repo

```bash
git clone <your-repo-url> /opt/form-app
cd /opt/form-app
```

### 3. Create the shared Caddy network

This only needs to be done once per VM. Caddy (running separately) and the web container communicate through this network.

```bash
docker network create caddy-net
```

### 4. Configure environment variables

```bash
# Web app
cp apps/web/.env.example apps/web/.env
nano apps/web/.env
```

Key values to set in `apps/web/.env`:

```bash
VITE_BASE_URL=https://yourdomain.com
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
BETTER_AUTH_SECRET=<generate-a-long-random-string>
# ... fill in the rest
```

```bash
# Worker
cp apps/worker/.env.example apps/worker/.env
nano apps/worker/.env
```

Key values to set in `apps/worker/.env`:

```bash
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

> **Note:** The database host in `DATABASE_URL` is `postgres` (the Docker service name), not `localhost`.

### 5. Configure Postgres credentials

Create a `.env` file at the repo root for Postgres credentials:

```bash
cat > .env <<'EOF'
POSTGRES_USER=formapp
POSTGRES_PASSWORD=change-me-to-a-strong-password
POSTGRES_DB=formapp
EOF
```

### 6. Build and start

```bash
docker compose up -d --build
```

Wait for Postgres to be healthy (web and worker depend on it):

```bash
docker compose ps  # postgres should show "healthy"
```

### 7. Run database migrations

```bash
# From your local machine (or CI) with the production DATABASE_URL:
DATABASE_URL=postgresql://... pnpm db:migrate
```

### 8. Point Caddy at the web container

In your Caddy config, reverse proxy to `web:3000` on `caddy-net`:

```caddy
yourdomain.com {
    reverse_proxy web:4321
    encode gzip
}

www.yourdomain.com {
    redir https://yourdomain.com{uri}
}
```

Reload Caddy after updating the config:

```bash
docker exec <caddy-container> caddy reload --config /etc/caddy/Caddyfile
```

### 9. Verify

```bash
docker compose ps
docker compose logs web
docker compose logs worker
curl https://yourdomain.com
```

## Redeployment

After pushing new code changes:

```bash
cd /opt/form-app
git pull
docker compose up -d --build

# If you have new database migrations:
# DATABASE_URL=postgresql://... pnpm db:migrate
```

### Redeploying only one service

```bash
docker compose up -d --build web     # Rebuild and restart web only
docker compose up -d --build worker  # Rebuild and restart worker only
```

## Environment Variables

### Root `.env` (Postgres credentials)

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |

### `apps/web/.env` (web app)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string (host = `postgres`) |
| `VITE_BASE_URL` | Your domain with https:// |
| `BETTER_AUTH_SECRET` | Auth secret (long random string) |
| `CREEM_API_KEY` | Payment provider key |
| `CREEM_WEBHOOK_SECRET` | Payment webhook secret |
| `PRODUCT_ID_STARTER` | Creem product ID |
| `PRODUCT_ID_PRO` | Creem product ID |
| `GITHUB_CLIENT_ID` | GitHub OAuth (optional) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth (optional) |
| `GOOGLE_CLIENT_ID` | Google OAuth (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |

### `apps/worker/.env` (worker)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string (host = `postgres`) |
| `RESEND_API_KEY` | Resend email service key |
| `RESEND_FROM_EMAIL` | Sender email address |
| `JOB_RETRY_LIMIT` | Max retries (default: 3) |
| `JOB_RETRY_DELAY_SECONDS` | Retry delay (default: 60) |
| `JOB_RETRY_BACKOFF` | Exponential backoff (default: true) |

## Common Commands

```bash
# ---- Logs ----
docker compose logs -f web
docker compose logs -f worker
docker compose logs -f postgres

# ---- Restart ----
docker compose restart web
docker compose restart worker
docker compose restart postgres

# ---- Stop ----
docker compose down          # Stop all, keep volumes
docker compose down -v       # Stop all and delete volumes (destructive!)

# ---- Shell ----
docker compose exec web sh
docker compose exec postgres psql -U formapp

# ---- Rebuild ----
docker compose up -d --build
docker compose up -d --build web
docker compose up -d --build worker
```

## Troubleshooting

**"caddy-net network not found"**

```bash
docker network create caddy-net
```

**Web/Worker can't connect to Postgres**

- Verify `DATABASE_URL` uses `postgres` as the host (not `localhost`)
- Check Postgres is healthy: `docker compose ps`
- Check logs: `docker compose logs postgres`

**Caddy not issuing TLS certificates**

- DNS must point to the VM's public IP
- Ports 80 and 443 must be open in your firewall/security group

**Worker not processing jobs**

- Check worker logs: `docker compose logs worker`
- Verify `DATABASE_URL` in `apps/worker/.env`
