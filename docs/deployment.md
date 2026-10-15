# Deployment

## API (`api/`)

1. Provision PostgreSQL 16+ and (optionally) Redis.
2. Build and run the image:

   ```bash
   docker build -t white-knight-api ./api
   docker run -p 3000:3000 --env-file api/.env.production white-knight-api
   ```

   The container runs `prisma migrate deploy` before starting, and exposes a health check at `/api/health`.
3. Required environment (see `api/.env.template`): `NODE_ENV=production`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` (≥16 chars), `RUN_TOKEN_SECRET` (≥16 chars), `APP_URL` (client origin, used in email links), `CORS_URLS`, `COOKIE_SECURE=true`, `RESEND_API_KEY`, `EMPEROR_KNIGHT_POINTS_THRESHOLD`. Optional: `REDIS_URL` (leaderboard cache; in-memory otherwise).

## Client (`app/`)

1. Vercel project root: `app/`, build `npm run build`, output `dist/`.
2. Edit `app/vercel.json` and replace `YOUR-API-HOST` with the API host. The rewrite serves `/api/*` from the same origin as the game, so the `SameSite=Lax` auth cookies stay first-party. (Alternatively set `VITE_API_URL` to a full API URL and configure cookies for cross-site use.)
3. Hashed bundles are served from `/static/` with immutable caching; generated assets in `/assets/` use a one-day cache with revalidation.

## Before go-live checklist

- Rotate the OpenAI key that was committed in early history and purge it from the remote (see `Product_Specification.md` P0-05).
- Set strong, unique JWT/run-token secrets per environment.
- Configure Resend sender domain for verification/reset email.
- Run `npm run test:e2e` in `api/` against a staging database.
