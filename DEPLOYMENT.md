# Deployment Guide

## Architecture

Two separate `docker-compose` files work together via shared Docker networks:

| File | Services | Purpose |
|------|----------|---------|
| `deploy/docker-compose.yml` | Caddy, Postgres | Shared infrastructure (runs once per VM) |
| `docker-compose.yml` | Web, Worker | Application services |

Two external Docker networks connect them:

| Network | Who joins | Purpose |
|---------|-----------|---------|
| `caddy-net` | Caddy, Web | Reverse proxy to app |
| `postgres-net` | Postgres, Web, Worker | Database access |

## First-Time Deployment

### 1. Prerequisites

SSH into your VM and install Docker:

```bash
# Install Docker (if not already installed)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

### 2. Clone the repo

```bash
git clone <your-repo-url> /opt/form-app
cd /opt/form-app
```

### 3. Create shared Docker networks

```bash
docker network create caddy-net
docker network create postgres-net
```

### 4. Configure and start infrastructure

```bash
cd deploy

# Set up Postgres credentials
cp .env.example .env
nano .env

# Set your domain
nano caddy/sites/form-app.caddy  # Replace yourdomain.com

# Start Caddy + Postgres
docker compose up -d
```

Wait for Postgres to be healthy:

```bash
docker compose ps  # postgres should show "healthy"
```

### 5. Configure and start the app

```bash
cd /opt/form-app

# Set up web env vars
cp apps/web/.env.example apps/web/.env
nano apps/web/.env
```

For production, set these values in `apps/web/.env`:

```bash
VITE_BASE_URL=https://yourdomain.com
DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@postgres:5432/POSTGRES_DB
BETTER_AUTH_SECRET=<generate-a-long-random-string>
# ... fill in the rest
```

> **Note:** The database host is `postgres` (the Docker service name), not `localhost`.

```bash
# Set up worker env vars
cp apps/worker/.env.example apps/worker/.env
nano apps/worker/.env
```

For production, set these values in `apps/worker/.env`:

```bash
DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@postgres:5432/POSTGRES_DB
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

```bash
# Build and start the app
docker compose up -d --build
```

### 6. Run database migrations

```bash
# TODO: Replace with your actual migration command.
# Example using drizzle-kit from your local machine:
#   DATABASE_URL=postgresql://... pnpm db:migrate
```

### 7. Verify

```bash
# All containers should be running
docker ps

# Check logs for errors
docker compose logs web
docker compose logs worker
docker compose -f deploy/docker-compose.yml logs caddy
docker compose -f deploy/docker-compose.yml logs postgres

# Test HTTPS
curl https://yourdomain.com
```

## Redeployment

After pushing new code changes:

```bash
cd /opt/form-app

# Pull latest code
git pull

# Rebuild and restart app containers (zero-downtime isn't built in)
docker compose up -d --build

# If you have new database migrations:
# DATABASE_URL=postgresql://... pnpm db:migrate
```

Only the app containers (`web`, `worker`) are rebuilt. Caddy and Postgres remain untouched.

### Redeploying only one service

```bash
docker compose up -d --build web     # Rebuild and restart web only
docker compose up -d --build worker  # Rebuild and restart worker only
```

## Environment Variables

### `deploy/.env` (infrastructure)

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

## Adding Another App

1. Add a `.caddy` file in `deploy/caddy/sites/`:

```caddy
# deploy/caddy/sites/other-app.caddy
other.example.com {
    reverse_proxy other-app:4000
    encode gzip
    handle_errors {
        respond "{err.status_code} {err.status_text}"
    }
    log {
        output file /data/logs/other-app-access.log {
            roll_size 10mb
            roll_keep 10
            roll_keep_for 720h
        }
        format json
    }
}

www.other.example.com {
    redir https://other.example.com{uri}
}
```

2. Reload Caddy (no restart needed):

```bash
docker compose -f deploy/docker-compose.yml exec caddy caddy reload --config /etc/caddy/Caddyfile
```

3. The other app's `docker-compose.yml` must join the shared networks:

```yaml
services:
  other-app:
    image: other-app:latest
    expose:
      - "4000"
    networks:
      - caddy-net
      - postgres-net  # Only if it needs database access

networks:
  caddy-net:
    external: true
  postgres-net:
    external: true
```

## Common Commands

```bash
# ---- Logs ----
docker compose logs -f web             # Follow web logs
docker compose logs -f worker          # Follow worker logs
docker compose -f deploy/docker-compose.yml logs -f caddy    # Caddy logs
docker compose -f deploy/docker-compose.yml logs -f postgres # Postgres logs

# ---- Restart ----
docker compose restart web             # Restart web
docker compose restart worker          # Restart worker

# ---- Stop ----
docker compose down                                          # Stop app
docker compose -f deploy/docker-compose.yml down             # Stop infrastructure

# ---- Shell ----
docker compose exec web sh             # Shell into web container
docker compose -f deploy/docker-compose.yml exec postgres psql -U formapp  # Postgres CLI

# ---- Caddy ----
docker compose -f deploy/docker-compose.yml exec caddy caddy reload --config /etc/caddy/Caddyfile
docker compose -f deploy/docker-compose.yml exec caddy tail -f /data/logs/access.log

# ---- Rebuild ----
docker compose up -d --build            # Rebuild all app containers
docker compose up -d --build web        # Rebuild web only
```

## Troubleshooting

**"caddy-net/postgres-net network not found"**

Create the shared networks (only needed once per VM):

```bash
docker network create caddy-net
docker network create postgres-net
```

**Web/Worker can't connect to Postgres**

- Verify `DATABASE_URL` uses `postgres` as the host (not `localhost`)
- Check both containers are on `postgres-net`: `docker network inspect postgres-net`
- Check Postgres is healthy: `docker compose -f deploy/docker-compose.yml ps`

**Caddy not issuing TLS certificates**

- DNS must point to the VM's public IP
- Ports 80 and 443 must be open (firewall/security group)
- Check logs: `docker compose -f deploy/docker-compose.yml logs caddy`

**Worker not processing jobs**

- Check worker logs: `docker compose logs worker`
- Verify `DATABASE_URL` in `apps/worker/.env`
- Check pg-boss schema exists: `docker compose -f deploy/docker-compose.yml exec postgres psql -U formapp -c '\dn'`
