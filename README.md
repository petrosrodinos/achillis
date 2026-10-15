# White Knight

A medieval side-view action campaign for the browser: 15 missions built on three reusable engines (Open Field Battle, Quest/Journey, Duel), with accounts, server-validated scores, levels and leaderboards. The product spec lives in [`Product_Specification.md`](Product_Specification.md); cross-team interfaces in [`docs/contracts.md`](docs/contracts.md); visual direction in [`docs/art-bible.md`](docs/art-bible.md).

| Part | Path | Stack |
|---|---|---|
| Game client | `app/` | React 19, TypeScript (strict), Vite 8, Tailwind CSS 4, react-three-fiber / three.js, Zustand, TanStack Query, zod |
| API | `api/` | NestJS 11, Prisma 7 (PostgreSQL), JWT in httpOnly cookies, throttling, Resend email |
| 3D assets | `tools/blender/` | Blender 5.2 headless Python scripts → Draco `.glb` |
| 2D assets | `tools/generate-images/` | OpenAI image models from committed prompts → WebP |
| Audio | `tools/audio/` | CC0 packs + offline processing → OGG/MP3 + manifest |

## Run locally

Prerequisites: Node 22, Docker Desktop.

```bash
# 1. Database (Postgres on :5433)
cd api && docker compose up -d

# 2. API (uses api/.env.staging — see api/.env.template for every variable)
npm install
npx dotenv -e .env.staging -- npx prisma migrate deploy
npm run start:staging            # http://localhost:3917/api, Swagger at /api/docs

# 3. Client (proxies /api to :3917, so auth cookies are first-party)
cd ../app && npm install
npm run dev                      # http://localhost:5180
```

Without `RESEND_API_KEY`, verification and password-reset links are written to the API log instead of being emailed.

## Checks

```bash
cd app && npm run typecheck && npm run lint && npm run test && npm run build
cd api && npm run lint && npm run test && npm run test:e2e && npm run build
```

## How the game is built

- **Engines** (`app/src/engines/`): `open-field`, `quest`, `duel`. Each accepts a typed, zod-validated config. Missions (`app/src/missions/configs.ts`) are data only; story text is in `missions/catalog.ts`.
- **Simulation** (`app/src/core/`): a fixed-timestep (60 Hz) world outside React — fighters, projectiles, hazards, AI controllers, combat math. React re-renders only when the HUD snapshot changes.
- **Bosses** (`app/src/bosses/`): pluggable modules (Mysterious Knight, Wizard, Witch Spirit, Evil Witch tag-team) selected by config.
- **Rendering** (`app/src/render/`): rigid-part glTF models are baked per clip into matrices at load, then every actor is drawn with per-part instancing (tint, hit flash and dithered fade per instance). Parallax environment, pooled particles, and a presentation director that turns every simulation event into sound, particles and camera shake.
- **Controls** (remappable in Settings): `A`/`D` move, `W` jump (climb when flying), `S` dive, `Space` dodge, `Shift` block, LMB light / RMB heavy attack, `E` interact / tag partner. Contextual moves: shield bash (block + light), jump slash, plunging strike (heavy in the air), dodge-lunge, 3-hit combo finisher, riposte after a perfect block. Battles: `Tab` select company, `Q` move, `R` hold, `F` retreat, middle mouse charge. Phones and tablets get on-screen controls.
- **Server-authoritative scoring**: `POST /progress/mission-start` issues a signed run token; `mission-complete` validates plausibility (duration, kill caps, replay) and computes the score from `api/src/modules/score/config/scoring.config.ts`.

## Assets

Generated and sourced assets are committed under `app/public/assets/`. To rebuild:

- **Models:** `"C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P tools/blender/build.py -- --preview` — see `tools/blender/README.md`.
- **Images:** `cd tools/generate-images && npm install && npm run generate` (reads `OPENAI_API_KEY` from the git-ignored repo-root `.env.temp`; build-time only) — see its README. `npm run check-secrets` verifies the key never reaches the client.
- **Audio:** `cd tools/audio && npm install && npm run all` — see `tools/audio/README.md`.

Third-party licences are logged in [`ASSETS.md`](ASSETS.md).

## Deploy

See [`docs/deployment.md`](docs/deployment.md): client on Vercel (`app/vercel.json` rewrites `/api/*` to the API so cookies stay first-party), API as a Docker image (`api/Dockerfile`, applies Prisma migrations on start), PostgreSQL managed separately.
