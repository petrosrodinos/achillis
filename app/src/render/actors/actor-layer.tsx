import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CREATURE_PALETTES, horsePalette, loadoutFor } from '@/content/loadouts';
import type { Fighter, ModelId } from '@/core/sim/types';
import type { World } from '@/core/sim/world';
import { InstancedModel } from '@/render/models/instanced-model';
import { loadModel, type BakedModel } from '@/render/models/model-library';
import { creaturePose, humanoidPose, humanoidMask, mountPose, resolveClip } from './pose';

const MODEL_IDS = ['humanoid', 'horse', 'hippogryph', 'troll', 'wolf', 'boar', 'bird', 'haunted-tree'] as const;
type LoadedId = (typeof MODEL_IDS)[number];

/** Slight turn toward the camera so side-view 3D characters read with depth. */
const YAW = 0.32;
/** Rider pelvis height above the horse origin when no Saddle anchor is available. */
/** Visual lane offset (see drawFighter). */
function laneYOf(f: Fighter) {
  return f.isPlayer || f.isBoss ? 0 : ((f.id % 3) - 1) * -0.14;
}

const FALLBACK_SADDLE = new THREE.Matrix4().makeTranslation(0, 1.25, 0);

export function preloadActorModels(ids: readonly string[] = MODEL_IDS) {
  return Promise.all(ids.map((id) => loadModel(id)));
}

interface Props {
  world: () => World | null;
}

/** Renders every fighter (and their mounts) through per-model instancing. No per-actor React nodes. */
export function ActorLayer({ world }: Props) {
  const [models, setModels] = useState<Partial<Record<LoadedId, BakedModel | null>>>({});
  useEffect(() => {
    let alive = true;
    void Promise.all(MODEL_IDS.map((id) => loadModel(id).then((m) => [id, m] as const))).then((pairs) => {
      if (alive) setModels(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, []);

  const renderers = useMemo(() => {
    const solid: Partial<Record<LoadedId, InstancedModel>> = {};
    for (const id of MODEL_IDS) {
      const m = models[id];
      if (m) solid[id] = new InstancedModel(m);
    }
    const spectral = models.humanoid ? new InstancedModel(models.humanoid, true) : null;
    return { solid, spectral };
  }, [models]);

  useEffect(
    () => () => {
      Object.values(renderers.solid).forEach((r) => r?.dispose());
      renderers.spectral?.dispose();
    },
    [renderers],
  );

  const group = useRef<THREE.Group>(null);
  const tmp = useMemo(
    () => ({ root: new THREE.Matrix4(), rider: new THREE.Matrix4(), saddle: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), e: new THREE.Euler() }),
    [],
  );

  useFrame((state) => {
    const w = world();
    const all = Object.values(renderers.solid) as InstancedModel[];
    for (const r of all) r.begin();
    renderers.spectral?.begin();
    if (w) {
      const now = state.clock.elapsedTime;
      for (const f of w.fighters) {
        if (f.removed) continue;
        drawFighter(f, now);
      }
    }
    for (const r of all) r.end();
    renderers.spectral?.end();
  });

  function rootFor(f: Fighter, out: THREE.Matrix4, scale: number, z = 0) {
    // Models face +X and show their weapon side to the camera; mirror (not rotate) to face left
    // so shields and silhouettes stay consistent (materials are double-sided).
    const yaw = f.facing > 0 ? -YAW : YAW;
    tmp.e.set(0, yaw, 0);
    tmp.q.setFromEuler(tmp.e);
    // Distortion (Wizard / Witch) sways actors slightly.
    tmp.p.set(f.x, f.y + (f.y <= 0.01 ? laneYOf(f) : 0), z);
    tmp.s.set(scale * f.facing, scale, scale);
    out.compose(tmp.p, tmp.q, tmp.s);
  }

  function drawFighter(f: Fighter, now: number) {
    const model = f.look.model as ModelId;
    const fade = f.fade;
    const flash = f.hitFlash;
    // Depth: player in front, others staggered slightly to avoid z-fighting.
    // Crowds spread over three shallow visual lanes (2.5D depth) so armies stay readable.
    // Gameplay stays on one plane; this is presentation only.
    const lane = f.isPlayer || f.isBoss ? 0 : (f.id % 3) - 1;
    const z = f.isPlayer ? 0.9 : lane * 0.5 + ((f.id % 7) - 3) * 0.02;

    if (model === 'humanoid') {
      const humanoid = f.look.spectral ? renderers.spectral : renderers.solid.humanoid;
      if (!humanoid || !models.humanoid) return;
      const skin = f.look.skin;
      const palette = loadoutFor(skin).palette;
      const visible = humanoidMask(models.humanoid, skin, f.helmet);
      const pose = humanoidPose(f, now);
      if (f.mounted) {
        const mountId: LoadedId = f.mounted === 'horse' ? 'horse' : 'hippogryph';
        const mount = renderers.solid[mountId];
        const mp = mountPose(f, now);
        rootFor(f, tmp.root, 1, z);
        if (mount) {
          mount.add({ root: tmp.root, clip: mp.clip, time: mp.time, loop: mp.loop, visible: null, palette: f.mounted === 'horse' ? horsePalette(skin) : CREATURE_PALETTES.hippogryph, flash: flash * 0.5, fade });
          if (!mount.anchor('Saddle', mp.clip, mp.time, mp.loop, tmp.saddle)) tmp.saddle.copy(FALLBACK_SADDLE);
        } else tmp.saddle.copy(FALLBACK_SADDLE);
        tmp.rider.multiplyMatrices(tmp.root, tmp.saddle);
        // Riders stay upright and full scale regardless of the anchor's orientation scale.
        humanoid.add({ root: tmp.rider, clip: resolveClip(models.humanoid, pose.clip), time: pose.time, loop: pose.loop, visible, palette, flash, fade });
        return;
      }
      rootFor(f, tmp.root, f.look.scale, z);
      humanoid.add({ root: tmp.root, clip: resolveClip(models.humanoid, pose.clip), time: pose.time, loop: pose.loop, visible, palette, flash, fade });
      return;
    }

    const r = renderers.solid[model as LoadedId];
    if (!r) return;
    const pose = creaturePose(f, now);
    rootFor(f, tmp.root, f.look.scale, z);
    r.add({ root: tmp.root, clip: pose.clip, time: pose.time, loop: pose.loop, visible: null, palette: CREATURE_PALETTES[model] ?? {}, flash, fade });
  }

  return (
    <group ref={group}>
      {Object.values(renderers.solid).map((r) => (r ? <primitive key={r.group.uuid} object={r.group} /> : null))}
      {renderers.spectral ? <primitive object={renderers.spectral.group} /> : null}
    </group>
  );
}
