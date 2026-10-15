import * as THREE from 'three';
import type { Palette } from '@/content/loadouts';
import { frameAt, type BakedModel } from './model-library';

/**
 * Draws every instance of one baked model with one InstancedMesh per part. Per-instance data:
 * matrix, tint colour (instanceColor), and fx = (hit flash 0..1, fade 0..1 dithered dissolve).
 */
export interface DrawEntry {
  root: THREE.Matrix4;
  clip: string;
  time: number;
  loop: boolean;
  /** Indices of parts to draw (loadout visibility). Null = all. */
  visible: Uint8Array | null;
  palette: Palette;
  flash: number;
  fade: number;
}

const FX_VERTEX = /* glsl */ `
attribute vec2 aFx;
varying vec2 vFx;
`;
const FX_FRAGMENT = /* glsl */ `
varying vec2 vFx;
`;

function patchMaterial(mat: THREE.MeshStandardMaterial, spectral: boolean) {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = FX_VERTEX + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vFx = aFx;');
    shader.fragmentShader =
      FX_FRAGMENT +
      shader.fragmentShader
        // Mirrored instances (facing left) reverse triangle winding, but their instance-transformed
        // normals are already correct; don't let double-sided rendering flip them into darkness.
        .replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;', 'float faceDirection = 1.0;'))
        .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
  float wkNoise = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898, 78.233))) * 43758.5453);
  if (vFx.y < 0.999 && vFx.y < wkNoise) discard;
  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.94, 0.82), clamp(vFx.x, 0.0, 1.0) * 0.75);
  ${spectral ? 'gl_FragColor.a *= 0.55;' : ''}`,
      );
  };
  mat.customProgramCacheKey = () => (spectral ? 'wk-fx-spectral' : 'wk-fx');
}

export class InstancedModel {
  readonly group = new THREE.Group();
  private meshes: THREE.InstancedMesh[] = [];
  private fx: THREE.InstancedBufferAttribute[] = [];
  private capacity = 0;
  private count = 0;
  private counts: Int32Array;
  private readonly model: BakedModel;
  private readonly spectral: boolean;
  private readonly tmp = new THREE.Matrix4();
  private readonly color = new THREE.Color();
  private readonly colorCache = new Map<string, THREE.Color>();

  constructor(model: BakedModel, spectral = false) {
    this.model = model;
    this.spectral = spectral;
    this.counts = new Int32Array(model.parts.length);
    this.group.name = `instanced:${model.id}${spectral ? ':spectral' : ''}`;
    this.allocate(16);
  }

  private allocate(capacity: number) {
    for (const m of this.meshes) {
      this.group.remove(m);
      m.dispose();
    }
    this.meshes = [];
    this.fx = [];
    this.capacity = capacity;
    for (const part of this.model.parts) {
      const mat = part.material.clone();
      // Mirrored instances (facing left) flip winding; render both sides.
      mat.side = THREE.DoubleSide;
      if (this.spectral) {
        mat.transparent = true;
        mat.depthWrite = false;
        mat.blending = THREE.AdditiveBlending;
        mat.emissive = new THREE.Color('#2f9f68');
        mat.emissiveIntensity = 0.8;
      }
      patchMaterial(mat, this.spectral);
      const geom = part.geometry.clone();
      const fx = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 2), 2);
      fx.setUsage(THREE.DynamicDrawUsage);
      geom.setAttribute('aFx', fx);
      const mesh = new THREE.InstancedMesh(geom, mat, capacity);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.count = 0;
      mesh.name = part.name;
      this.meshes.push(mesh);
      this.fx.push(fx);
      this.group.add(mesh);
    }
  }

  begin() {
    this.count = 0;
    this.counts.fill(0);
  }

  private tint(hex: string | undefined, base: THREE.Color): THREE.Color {
    if (!hex) return base;
    let c = this.colorCache.get(hex);
    if (!c) {
      c = new THREE.Color(hex);
      this.colorCache.set(hex, c);
    }
    return c;
  }

  add(e: DrawEntry) {
    const clip = this.model.clips[e.clip] ?? this.model.clips.Idle ?? Object.values(this.model.clips)[0];
    if (!clip) return;
    this.count++;
    if (this.count > this.capacity) this.allocate(this.capacity * 2);
    const frame = frameAt(clip, e.time, e.loop);
    const parts = this.model.parts;
    const base = frame * parts.length * 16;
    for (let p = 0; p < parts.length; p++) {
      if (e.visible && !e.visible[p]) continue;
      const mesh = this.meshes[p];
      const i = this.counts[p]++;
      this.tmp.fromArray(clip.mats, base + p * 16);
      this.tmp.premultiply(e.root);
      mesh.setMatrixAt(i, this.tmp);
      const part = parts[p];
      this.color.copy(this.tint(e.palette[part.matKey as keyof Palette], part.baseColor));
      mesh.setColorAt(i, this.color);
      const fx = this.fx[p];
      fx.setXY(i, e.flash, e.fade);
    }
  }

  end() {
    for (let p = 0; p < this.meshes.length; p++) {
      const mesh = this.meshes[p];
      const n = this.counts[p];
      mesh.count = n;
      if (n > 0) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        this.fx[p].needsUpdate = true;
      }
    }
  }

  /** Matrix of an anchor (e.g. Saddle) for a clip/time, in model space. */
  anchor(name: string, clipName: string, time: number, loop: boolean, out: THREE.Matrix4): boolean {
    const clip = this.model.clips[clipName] ?? Object.values(this.model.clips)[0];
    const data = clip?.anchors[name];
    if (!clip || !data) return false;
    out.fromArray(data, frameAt(clip, time, loop) * 16);
    return true;
  }

  dispose() {
    for (const m of this.meshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
      m.dispose();
    }
  }
}
