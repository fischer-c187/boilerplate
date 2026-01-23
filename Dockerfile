# Stage 1: Builder
FROM node:24-alpine AS builder

# Bonne pratique : pinner la version de pnpm pour éviter les surprises (v9 ou v10)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Disable Husky
ENV HUSKY=0

# On installe TOUT ici pour pouvoir builder
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_BASE_URL

RUN pnpm run build

# Stage 2: Runner
FROM node:24-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 1. On définit la prod tout de suite
ENV NODE_ENV=production

# 2. Création de l'utilisateur AVANT de copier les fichiers
RUN addgroup -g 1001 -S rick && \
  adduser -S rick -u 1001 -G rick

# 3. Copie des fichiers de dépendances avec les bonnes permissions
COPY --chown=rick:rick package.json pnpm-lock.yaml ./

# 4. Installation UNIQUEMENT des dépendances de prod (--prod)
# Le --frozen-lockfile garantit qu'on respecte le lock
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# 5. Copie du build depuis le builder avec les permissions
COPY --chown=rick:rick --from=builder /app/dist ./dist

# Copie des configs Drizzle
COPY --chown=rick:rick --from=builder /app/src/server/adaptaters/db/drizzle.config.ts ./src/server/adaptaters/db/drizzle.config.ts
COPY --chown=rick:rick --from=builder /app/drizzle ./drizzle

# Copie du script d'entrypoint
COPY --chown=rick:rick scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Plus besoin de chown -R /app ici, c'est déjà fait au fur et à mesure !

USER rick

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["pnpm", "start"]
