# ===== Build stage: build toàn bộ workspace =====
FROM node:20-alpine AS build
RUN npm install -g pnpm@9
WORKDIR /app

# Cache layer deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY libs ./libs
COPY apps ./apps
RUN pnpm install --frozen-lockfile

RUN pnpm --filter @capstone/common run build \
 && pnpm -r run build

RUN pnpm -r run prisma:generate

# ===== Runtime stage =====
FROM node:20-alpine AS runtime
RUN npm install -g pnpm@9
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
CMD ["node", "apps/api-gateway/dist/server.js"]