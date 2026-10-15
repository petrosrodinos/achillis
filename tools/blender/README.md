# Blender asset pipeline

Procedural, script-only models and animations for White Knight. Everything here is rebuilt from
Python; never hand-edit the exported `.glb` files. Output contract: `docs/contracts.md` §4.1.

Blender 5.2 LTS (4.4+ works — slotted-action API). On this machine it is not on `PATH`:

```bash
B="/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"   # Git Bash
```

## Commands

| What | Command |
|---|---|
| Build all + validate | `"$B" -b --factory-startup -P tools/blender/build.py` |
| Build all + validate + previews | `"$B" -b --factory-startup -P tools/blender/build.py -- --preview` |
| Only one asset | `"$B" -b --factory-startup -P tools/blender/build.py -- --only horse` |
| Humanoid | `"$B" -b --factory-startup -P tools/blender/build_humanoid.py -- app/public/assets/models/humanoid.glb` |
| Horse | `"$B" -b --factory-startup -P tools/blender/build_horse.py -- app/public/assets/models/horse.glb` |
| Validate | `"$B" -b --factory-startup -P tools/blender/validate.py [-- humanoid.glb horse.glb]` (exit 1 on failure) |
| Previews | `"$B" -b --factory-startup -P tools/blender/render_preview.py -- --set all` (`knight`, `loadouts`, `horse`, `mounted`) |

Previews are written to `tools/blender/previews/` (git-ignored): `knight_*.png` (every clip at key
frames / attack phase boundaries), `loadouts.png` (archer, wizard, witch, viking, zombie, saracen, …),
`horse.png`, `mounted.png` (knight parented to the horse `Saddle`). They render the **exported**
files with an orthographic camera looking along glTF −Z, like the game.

## Layout

| File | Purpose |
|---|---|
| `lib/scene.py` | scene reset (30 fps, metric), CLI args, empties |
| `lib/materials.py` | named material factory (neutral tint-ready base colours, soft roughness/low metalness) |
| `lib/geom.py` | `Geo` vertex/face builder: `sweep`/`loft`/`lathe` (superellipse sections, asymmetric radii), `superquad`/`rounded_box`, `extrude_outline` (bevelled 2D outlines), `torus`, deform/bend helpers, `to_object` (smooth + sharp-by-angle shading) |
| `lib/rig.py` | `Rig` (animated-empty joint hierarchy, FK, rigid `attach` in any reference pose), 2-bone planar IK, plus `build_armature`/`attach_to_bone` (bone-parent alternative with correct parent-inverse) |
| `lib/anim.py` | `bake_clip`: one Action per clip (one slot per joint) + an NLA track named after the clip on every joint, per-key interpolation presets, cyclic padding |
| `lib/export.py` | `export_glb`: Draco, +Y up, all objects (hidden too), `export_animation_mode='NLA_TRACKS'`, force-sampled 30 fps, rest pose written as node TRS, optional retime |
| `lib/gltf.py` | pure-Python GLB reader/writer, durations, triangle counts, rest-pose world matrices, clip retiming |
| `humanoid_rig.py` | joint layout + pose builder (absolute sagittal limb angles, leg IK) |
| `humanoid_parts.py` | every humanoid mesh (base body + all equipment variants) |
| `humanoid_clips.py` | all 26 humanoid clips |
| `build_horse.py` | horse geometry, procedural gait cycles, clips |

## Conventions

- Blender: +X forward, +Z up, +Y = character's left. glTF: +X forward, +Y up, +Z = character's right
  (towards a camera at +Z looking −Z, so the game sees the weapon side).
- Rig = hierarchy of **empties** (`J_*`), identity rest rotation, object-level animation. Meshes are
  rigid children; no skins, weights, shape keys or modifiers. Rotation about Y swings in the side
  plane (positive = clockwise as the game camera sees it).
- Every clip keys every joint (rotation; plus location on `J_Hips` / `J_Body`) so cross-fades never
  inherit stale transforms.
- Attack clips (†) are 30 frames with keys at 0 / 10.5 / 15 / 18 / 30 (anticipation, swing, impact,
  recovery). Clips whose contract length is not a whole number of frames (`BlockRaise` 0.15 s,
  `Land` 0.25 s) are baked over the next whole frame and uniformly retimed in the GLB.
- Materials are named exactly per contract; colours are neutral so the client can tint by name.
  Previews tint with the art-bible palette to mimic the client.

## Adding an asset

1. `build_<asset>.py`: `scene.reset()`, `materials.library([...])`, build a `Rig`, create parts with
   `geom.*` + `geom.to_object`, `rig.attach(obj, joint)`, `anim.bake_clip(...)` per clip,
   `export.export_glb(path)`.
2. Register it in `build.py` `ASSETS`, add checks to `validate.py`, and a sheet in `render_preview.py`.
