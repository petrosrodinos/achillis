# tools/generate-images

This is the build-time pipeline that produces every 2D image in `app/public/assets/images/` (see `docs/contracts.md` §4.2) with the OpenAI Images API. The rules are in `Product_Specification.md` §3.2, and the look comes from `docs/art-bible.md`.

Nothing here runs at game runtime. The client only ever loads the finished `.webp` files.

## Setup

```bash
cd tools/generate-images
npm install
```

The API key is read from `OPENAI_API_KEY` in the **repo-root `.env.temp`**, which is git-ignored. The scripts parse that file themselves:

- they never copy the key into `process.env`;
- they never log the key or write it anywhere else.

Never import anything from this folder into `app/`.

## Commands

| Command | What it does |
|---|---|
| `npm run build-prompts` | Regenerates `prompts/**/*.json` from `src/build-prompts.mjs`, which is the source of the prompt text |
| `npm run generate -- --dry-run` | Lists what would be generated and counts the calls per model, size and quality |
| `npm run generate -- [--only <glob>] [--force] [--concurrency 4]` | Generates and post-processes images. Outputs that already exist are skipped unless you pass `--force` |
| `npm run postprocess -- [--only <glob>]` | Re-runs post-processing from the cached raw PNGs in `.cache/raw/`, with no API calls |
| `npm run previews -- [--only <envId glob>]` | Writes PNG contact sheets for QA to `.cache/previews/` |
| `npm run check-secrets` | Fails if the key value or the name `OPENAI_API_KEY` appears in `app/src`, `app/public`, `app/dist` or `app/.env*` |

`--only` takes comma-separated globs and matches either the asset id or its output path. For example:

- `--only "env/forest/*"`
- `--only "portraits/*,icons/lock"`
- `--only "env/*/fore"`

Failed requests are retried with exponential backoff on 429, 5xx and network errors, and `Retry-After` is honoured. Each run prints:

- the number of calls per model, size and quality;
- an estimated USD cost.

Every call is also appended to `.cache/usage.jsonl` with its token usage.

## Models

| Use | Model | Quality |
|---|---|---|
| Opaque images: sky layers, fog (generated white-on-black), ground, parchment | `gpt-image-2` | medium |
| Title and menu art, mission illustrations, portraits | `gpt-image-2` | high |
| Transparent images: far, mid and fore parallax layers, icons | `gpt-image-1.5` | medium |

Transparent images use `gpt-image-1.5` because `gpt-image-2` rejects `background: "transparent"` with HTTP 400 (checked 2026-10-15).

`gpt-image-2` accepts any size whose sides are multiples of 16, so skies are generated directly at 2048×1024, and title and menu art at 1920×1088 before cropping to 1080. Transparent layers are generated at 1536×1024 and then scaled and cropped. A single asset can set `"model"` in its JSON to override this choice.

## Prompts and style

- `prompts/style.json` holds the shared style suffixes, one per asset family: `background`, `texture`, `illustration`, `portrait`, `icon`, `keyart`, `raw`. The `background` suffix is the art-bible style prompt. Each asset names one suffix in its `style` field, and that suffix is appended to the asset's own `prompt`.
- `prompts/env/<envId>.json` has four entries (`sky`, `far`, `mid`, `fore`).
  - The text is built from one shared lighting/palette sentence for the environment, so all four layers match.
  - Each layer also gets a description of what that layer contains and an instruction that everything above it stays transparent.
  - Interiors (`dark-hallway`, `mirror-hall`, `grand-hall`, `fortress-halls`, `fortress-dungeon`) use the opaque `sky` layer as the back wall.
- `prompts/env/_fog.json`, `ground.json`, `ui.json`, `missions.json`, `portraits.json` and `icons.json` cover the other asset families.

Asset schema:

```json
{ "id": "env/forest/mid", "outPath": "env/forest/mid.webp", "style": "background",
  "prompt": "...", "size": "1536x1024", "quality": "medium", "background": "transparent",
  "postprocess": [ { "op": "seamless", "axes": "x", "width": 2048, "height": 1024, "blend": 0.18 }, { "op": "webp", "quality": 82, "alphaQuality": 90 } ] }
```

## Post-processing ops (`src/process.mjs`)

| Op | What it does |
|---|---|
| `fit` | Cover-resizes and crops to the contract size |
| `seamless` | Offset-and-blend tiling, on the x axis or on both axes (`xy`). The image is scaled to `width + blend`, and the overflow past the right edge is cross-faded into the left edge with premultiplied alpha and a smoothstep curve, so pixel 0 continues exactly from pixel `width-1`. |
| `alphaClean` | Removes the faint haze the model leaves in transparent areas |
| `anchorBottom` | Moves a band the model painted mid-frame down to the bottom edge, then bleeds the lowest pixels down so there is no gap |
| `placeTop` | Puts the top of the band at a set height: far 0.44, mid 0.57, fore 0.72 of the image height. Far and mid can also be moved up; the gap left underneath is filled with a horizontally blurred continuation that cross-fades in, so there are no streaks. |
| `topFade` | Guarantees the area above the band is fully transparent |
| `lumaToAlpha` | Turns white-on-black fog into a tinted colour whose alpha comes from the luminance |
| `trim` / `contain` | Icons: crop to the object, then pad to 256×256 |
| `webp` | Encoder settings: quality 82, alpha quality 90 |

## Adding an asset

1. Add the asset to `src/build-prompts.mjs`. For a new environment, add an entry to `ENVS`. For anything else, add to the matching table, or write a new JSON file under `prompts/` that follows the schema above.
2. Run `npm run build-prompts`, then `npm run generate -- --only "<id>"`.
3. Run `npm run previews` and look at `.cache/previews/` to check:
   - transparency;
   - that there is no text, watermark or people in backgrounds;
   - that the palette is consistent;
   - that no tiling seam is visible.
4. If an image is bad, change the prompt and re-run with `--force --only "<id>"`. If only the post-processing is wrong, change the ops and run `npm run postprocess`, which costs nothing.
5. Commit the prompt JSON and the `.webp` output, and update `docs/contracts.md` and `ASSETS.md` when there is a new path.

`.cache/` (raw downloads, previews, usage log) and `node_modules/` are git-ignored.

## Retouching

`npm run retouch` applies `src/retouch.mjs`: targeted, API-free fixes that make bright artefacts (a stray figure in `env/swamp-coast/fore`, smoke puffs in `env/fortress-airspace/far`) transparent. Run it after regenerating those layers only if the artefacts reappear.
