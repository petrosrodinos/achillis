# White Knight API — production image.
# Build:  docker build -t white-knight-api ./api
# Run:    docker run --env-file .env.production -p 3000:3000 white-knight-api
# Migrations are applied on start (`prisma migrate deploy`) before the server boots.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Dev dependencies are kept: the Prisma CLI is needed at start-up for `migrate deploy`.
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000
RUN addgroup -S wk && adduser -S wk -G wk
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json
USER wk
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
