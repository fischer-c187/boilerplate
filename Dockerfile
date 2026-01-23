# Stage 1: Builder - Build the application
FROM node:24-alpine AS builder

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Disable Husky in Docker (no need for git hooks)
ENV HUSKY=0

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build args for Vite environment variables
ARG VITE_BASE_URL

# Build application (client + server + types)
RUN pnpm run build

# Stage 2: Runner - Production image
FROM node:24-alpine AS runner

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install ONLY production dependencies (skip scripts like husky prepare)
RUN pnpm install --frozen-lockfile

# Copy build outputs from builder stage
COPY --from=builder /app/dist ./dist

# Copy drizzle config and migration script (needed for db:migrate)
COPY --from=builder /app/src/server/adaptaters/db/drizzle.config.ts ./src/server/adaptaters/db/drizzle.config.ts
COPY --from=builder /app/drizzle ./drizzle

# Copy entrypoint script and make it executable
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# create non-root user for security
RUN addgroup -g 1001 -S rick
RUN adduser -S rick -u 1001 -G rick

# Change ownership of the app directory and entrypoint to the non-root user
RUN chown -R rick:rick /app
RUN chown rick:rick /usr/local/bin/docker-entrypoint.sh

# Switch to the non-root user
USER rick

# Expose application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Use entrypoint script to run migrations before starting app
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["pnpm", "start"]
