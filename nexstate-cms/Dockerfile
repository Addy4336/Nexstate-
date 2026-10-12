# ================================
# NexState CMS - Dockerfile
# Multi-stage build for Next.js with Bun
# ================================

# Base stage
FROM oven/bun:1 AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Dependencies stage
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install

# Build stage
FROM base AS build
COPY package.json bun.lock* ./
RUN bun install

# Copy source code
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
# Increase Node.js memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=8192"
# Limit build workers to reduce memory usage
ENV NEXT_BUILD_WORKERS=2

# Build-time placeholder environment variables (overridden at runtime)
ENV BETTER_AUTH_SECRET="build-time-placeholder-secret-replace-at-runtime"
ENV BETTER_AUTH_BASE_URL="http://localhost:3001"
ENV TOTALPAY_MERCHANT_KEY="placeholder"
ENV TOTALPAY_PASSWORD="placeholder"
ENV TOTALPAY_CHECKOUT_HOST="https://checkout.totalpay.global"
ENV NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder"
ENV SUPABASE_SERVICE_ROLE_KEY="placeholder"

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 -g nodejs nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/package.json ./

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start the application
CMD ["bun", "server.js"]
