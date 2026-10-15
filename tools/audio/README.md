# White Knight — audio pipeline

Offline tooling that produces every sound the game ships with:

- `app/public/assets/audio/sfx/<name>[-N].{ogg,mp3}` — mono, trimmed, peak-normalised to -3 dBFS
- `app/public/assets/audio/music/<name>.{ogg,mp3}` — stereo, loudness-matched, loop-ready (music + `amb-*` ambience beds)
- `app/public/assets/audio/manifest.json` — the shape defined in `docs/contracts.md` §4.3

Nothing runs at game runtime; the client's audio manager only reads the manifest and the files.

## Rebuild

```bash
cd tools/audio
npm install            # ffmpeg-static, ffprobe-static, adm-zip, 7zip-bin (no system ffmpeg needed)
npm run fetch          # download all sources into .cache/src/ (git-ignored, ~250 MB)
npm run synth          # write project-synthesised sources into .cache/synth/
npm run build          # process + encode into app/public/assets/audio/, write manifest.json
npm run verify         # check manifest vs contract, decode every file; add -- --list for a full table
# or: npm run all
```

`node build.mjs --only hit-flesh,beam` rebuilds selected names and merges them into the existing manifest.

## Files

| File | Purpose |
|---|---|
| `sources.mjs` | Every third-party source: download URL(s), page, author, licence. Mirrors the Audio section of `/ASSETS.md`. |
| `recipes.mjs` | What each SFX variant / music track is made of (source refs, trims, layers, pitch, loop settings). Edit this to change a sound. |
| `fetch.mjs` | Downloads and extracts sources (zip via adm-zip, 7z via 7zip-bin). Downloads are data only — nothing in them is executed. |
| `synth/` | Deterministic Node synthesis for effects with no suitable recording (`beam` core). Writes 16-bit WAV. |
| `build.mjs` | Processing: decode → mono/stereo → trim/segment → layer/mix → silence-trim → micro-fades → peak-normalise (SFX) or loudness-match + limit (music) → seamless loop crossfade → encode Vorbis `.ogg` + `.mp3`. |
| `verify.mjs` | Contract check: all names present, `.ogg` + `.mp3` exist and decode, channel counts, durations, peaks, loop flags. |
| `inventory.mjs` | Dev helper: writes `.cache/inventory.tsv` (every downloaded file with duration) to help pick sources. |

## Processing details

- **SFX:** mono 44.1 kHz; leading/trailing silence removed below -55 dBFS; 2 ms fade-in, ≤30 ms fade-out; peak normalised to -3 dBFS; clips shorter than 0.3 s padded with silence (very short MP3s are not reliably detected by some decoders). Encoded Vorbis q3 (~80–96 kbps) and MP3 96 kbps CBR.
- **Variants:** a name with several variants is written as `<name>-1`, `<name>-2`, … and all are listed under the one manifest key; single-variant names are written as `<name>`.
- **Music:** stereo; integrated loudness matched with EBU R128 (music -15…-18 LUFS, ambience beds -23…-27 LUFS), then a -3 dBFS look-ahead limiter (leaves headroom for codec overshoot). Encoded Vorbis q2 / MP3 112 kbps (ambience Vorbis q0 / MP3 80 kbps).
- **Loops:** tracks not authored as loops get a tail→head crossfade (`xfade` seconds, quarter-sine curves): output = `T[x:]` crossfaded with `T[0:x]`, so the last sample flows straight into the first. Tracks authored as loops (`xfade: 0`) are left untouched. `victory` is a one-shot with a fade-out (`loop: false`).
- **amb-battle** is mixed in `build.mjs` from CC0 recordings (crowd shouting + war drums + scattered sword clashes), see `BATTLE_BED` in `recipes.mjs`.

## Adding or changing a sound

1. Find a CC0 (preferred) or CC-BY source; add it to `sources.mjs` and run `npm run fetch`.
2. Reference it in `recipes.mjs` (`'<source-id>:<path-suffix>'`, see the header comment there).
3. `node build.mjs --only <name>` then `npm run verify`.
4. Log the source in the **Audio** section of `/ASSETS.md` (CC-BY also needs an in-game credit).
