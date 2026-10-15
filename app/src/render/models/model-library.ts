import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/**
 * Loads rigid-part glTF models (docs/contracts.md §4.1) and bakes every animation clip into
 * per-part matrices at 60 fps. Rendering then needs no AnimationMixer or scene graph per actor:
 * each part is drawn with instancing using `root × baked[clip][frame][part]`.
 */

export const BAKE_FPS = 60;

export interface BakedPart {
  name: string;
  /** Group name used for loadout visibility (e.g. Helm_Great), resolved from the node path. */
  group: string;
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
  /** Material name (Primary, Metal, …) used for tinting. */
  matKey: string;
  baseColor: THREE.Color;
}

export interface BakedClip {
  name: string;
  duration: number;
  frames: number;
  /** frames × parts × 16 */
  mats: Float32Array;
  /** Anchor node matrices: name → frames × 16 */
  anchors: Record<string, Float32Array>;
}

export interface BakedModel {
  id: string;
  parts: BakedPart[];
  clips: Record<string, BakedClip>;
  anchorNames: string[];
}

const GROUP_RE = /^(Base|Armor|Helm|Hair|Crest|Back|Tabard|Weapon|Shield|Offhand)_/;
const ANCHORS = ['Saddle', 'Socket_Projectile', 'Socket_Head'];

let loader: GLTFLoader | null = null;
function getLoader() {
  if (!loader) {
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.setMeshoptDecoder(MeshoptDecoder);
  }
  return loader;
}

function resolveGroup(obj: THREE.Object3D, root: THREE.Object3D): string {
  let o: THREE.Object3D | null = obj;
  while (o && o !== root) {
    const n = o.name.replace(/\.\d+$/, '');
    if (GROUP_RE.test(n)) return n;
    o = o.parent;
  }
  return obj.name;
}

function bake(id: string, gltf: { scene: THREE.Group; animations: THREE.AnimationClip[] }): BakedModel {
  const root = gltf.scene;
  root.position.set(0, 0, 0);
  root.rotation.set(0, 0, 0);
  root.scale.set(1, 1, 1);
  root.updateMatrixWorld(true);

  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  const anchorObjs = ANCHORS.map((n) => root.getObjectByName(n)).filter((o): o is THREE.Object3D => !!o);

  const parts: BakedPart[] = meshes.map((m) => {
    const src = (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;
    const matKey = (src.name || 'Default').replace(/\.\d+$/, '');
    const material = src.clone();
    const baseColor = src.color ? src.color.clone() : new THREE.Color(1, 1, 1);
    material.color = new THREE.Color(1, 1, 1);
    return { name: m.name, group: resolveGroup(m, root), geometry: m.geometry, material, matKey, baseColor };
  });

  const mixer = new THREE.AnimationMixer(root);
  const clips: Record<string, BakedClip> = {};
  const rootInv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const tmp = new THREE.Matrix4();

  for (const clip of gltf.animations) {
    mixer.stopAllAction();
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    const frames = Math.max(1, Math.round(clip.duration * BAKE_FPS) + 1);
    const mats = new Float32Array(frames * parts.length * 16);
    const anchors: Record<string, Float32Array> = {};
    for (const a of anchorObjs) anchors[a.name] = new Float32Array(frames * 16);
    for (let f = 0; f < frames; f++) {
      const t = Math.min(clip.duration, f / BAKE_FPS);
      action.time = t;
      mixer.update(0);
      root.updateMatrixWorld(true);
      for (let p = 0; p < meshes.length; p++) {
        tmp.multiplyMatrices(rootInv, meshes[p].matrixWorld);
        tmp.toArray(mats, (f * parts.length + p) * 16);
      }
      for (const a of anchorObjs) {
        tmp.multiplyMatrices(rootInv, a.matrixWorld);
        tmp.toArray(anchors[a.name], f * 16);
      }
    }
    clips[clip.name] = { name: clip.name, duration: clip.duration, frames, mats, anchors };
    mixer.uncacheAction(clip);
  }
  // A static rest pose for models without clips.
  if (Object.keys(clips).length === 0) {
    const mats = new Float32Array(parts.length * 16);
    meshes.forEach((m, p) => tmp.multiplyMatrices(rootInv, m.matrixWorld).toArray(mats, p * 16));
    const anchors: Record<string, Float32Array> = {};
    for (const a of anchorObjs) anchors[a.name] = new Float32Array(tmp.multiplyMatrices(rootInv, a.matrixWorld).toArray());
    clips.Rest = { name: 'Rest', duration: 0, frames: 1, mats, anchors };
  }
  return { id, parts, clips, anchorNames: anchorObjs.map((a) => a.name) };
}

const cache = new Map<string, Promise<BakedModel | null>>();
const ready = new Map<string, BakedModel | null>();

/** Load + bake a model by id (file app/public/assets/models/<id>.glb). Resolves null if missing. */
export function loadModel(id: string): Promise<BakedModel | null> {
  let p = cache.get(id);
  if (!p) {
    p = getLoader()
      .loadAsync(`/assets/models/${id}.glb`)
      .then((gltf) => bake(id, gltf))
      .catch((err) => {
        console.warn(`[models] ${id} unavailable`, err);
        return null;
      })
      .then((m) => {
        ready.set(id, m);
        return m;
      });
    cache.set(id, p);
  }
  return p;
}

export function getModel(id: string): BakedModel | null {
  return ready.get(id) ?? null;
}

/** Raw (unbaked) scene for static props (props.glb, ship.glb). */
const rawCache = new Map<string, Promise<THREE.Group | null>>();
export function loadRawScene(id: string): Promise<THREE.Group | null> {
  let p = rawCache.get(id);
  if (!p) {
    p = getLoader()
      .loadAsync(`/assets/models/${id}.glb`)
      .then((g) => g.scene)
      .catch(() => null);
    rawCache.set(id, p);
  }
  return p;
}

/** Sample a baked clip frame index for time t (looping or clamped). */
export function frameAt(clip: BakedClip, t: number, loop: boolean): number {
  if (clip.frames <= 1 || clip.duration <= 0) return 0;
  let tt = t;
  if (loop) {
    tt = t % clip.duration;
    if (tt < 0) tt += clip.duration;
  } else tt = Math.max(0, Math.min(clip.duration, t));
  return Math.min(clip.frames - 1, Math.round(tt * BAKE_FPS));
}
