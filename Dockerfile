FROM node:24-alpine AS base
ENV CI=true
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

# ── Builder ────────────────────────────────────────────────────────────────────
FROM base AS builder

# Build tools required to compile better-sqlite3 native addon
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# apps/api serves the built web app as static files from ./public (relative to dist/index.js)
RUN cp -r apps/web/dist apps/api/public

# `pnpm prune --prod` empties workspace-package node_modules in this pnpm version;
# reinstalling prod-only from the frozen lockfile is the reliable way to drop dev deps
# (recompiles the better-sqlite3 native addon too, since build tools are still present here).
RUN rm -rf node_modules apps/web/node_modules apps/api/node_modules
RUN pnpm install --frozen-lockfile --prod

# ── Runner ─────────────────────────────────────────────────────────────────────
FROM base AS runner

WORKDIR /app

# Copy pruned node_modules from builder — includes the compiled better-sqlite3 binary
# and all other runtime dependencies (workspace-hoisted at the repo root).
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

# Compiled API + statically-built web app it serves
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/public ./apps/api/public

# Runtime files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/apps/web/public/images ./apps/web/public/images
COPY --from=builder /app/productseed.json ./productseed.json

RUN mkdir -p /app/data

RUN addgroup -g 1001 -S nodejs && adduser -S react -u 1001
RUN chown -R react:nodejs /app
USER react

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/db.sqlite

EXPOSE 3000
VOLUME ["/app/data"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "scripts/docker-entrypoint.js"]
