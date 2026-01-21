FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Final image
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

USER bun
EXPOSE 3001

CMD ["bun", "run", "start"]
