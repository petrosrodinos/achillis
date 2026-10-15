import * as THREE from 'three';

/**
 * Pooled camera-facing particle system (one InstancedMesh per blend mode). No allocations per
 * particle; dead slots are recycled. Used for sparks, dust, magic, rain and wind streaks.
 */
export interface ParticleSpec {
  x: number;
  y: number;
  z?: number;
  vx?: number;
  vy?: number;
  life: number;
  size: number;
  /** Size multiplier at end of life. */
  grow?: number;
  color: string | THREE.Color;
  gravity?: number;
  drag?: number;
  /** Elongate along velocity (sparks, rain). */
  stretch?: number;
  additive?: boolean;
  alpha?: number;
}

const MAX = 1400;

function softDot(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

class Pool {
  readonly mesh: THREE.InstancedMesh;
  private x = new Float32Array(MAX);
  private y = new Float32Array(MAX);
  private z = new Float32Array(MAX);
  private vx = new Float32Array(MAX);
  private vy = new Float32Array(MAX);
  private life = new Float32Array(MAX);
  private maxLife = new Float32Array(MAX);
  private size = new Float32Array(MAX);
  private grow = new Float32Array(MAX);
  private gravity = new Float32Array(MAX);
  private drag = new Float32Array(MAX);
  private stretch = new Float32Array(MAX);
  private alpha = new Float32Array(MAX);
  private colors: THREE.Color[] = Array.from({ length: MAX }, () => new THREE.Color());
  private alphaAttr: THREE.InstancedBufferAttribute;
  private cursor = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly axis = new THREE.Vector3(0, 0, 1);

  constructor(additive: boolean, map: THREE.Texture) {
    const geom = new THREE.PlaneGeometry(1, 1);
    this.alphaAttr = new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1);
    this.alphaAttr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute('aAlpha', this.alphaAttr);
    const mat = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false });
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = 'attribute float aAlpha;\nvarying float vAlpha;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vAlpha = aAlpha;');
      sh.fragmentShader = 'varying float vAlpha;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.a *= vAlpha;');
    };
    this.mesh = new THREE.InstancedMesh(geom, mat, MAX);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = additive ? 50 : 40;
    this.mesh.count = MAX;
    for (let i = 0; i < MAX; i++) this.mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
  }

  spawn(p: ParticleSpec) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % MAX;
    this.x[i] = p.x;
    this.y[i] = p.y;
    this.z[i] = p.z ?? 1.2;
    this.vx[i] = p.vx ?? 0;
    this.vy[i] = p.vy ?? 0;
    this.life[i] = p.life;
    this.maxLife[i] = p.life;
    this.size[i] = p.size;
    this.grow[i] = p.grow ?? 1;
    this.gravity[i] = p.gravity ?? 0;
    this.drag[i] = p.drag ?? 0;
    this.stretch[i] = p.stretch ?? 0;
    this.alpha[i] = p.alpha ?? 1;
    this.colors[i].set(p.color);
  }

  update(dt: number) {
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) {
        if (this.alphaAttr.getX(i) !== 0) {
          this.alphaAttr.setX(i, 0);
          this.m.makeScale(0, 0, 0);
          this.mesh.setMatrixAt(i, this.m);
        }
        continue;
      }
      this.life[i] -= dt;
      const k = Math.max(0, this.life[i] / this.maxLife[i]);
      this.vy[i] -= this.gravity[i] * dt;
      const d = Math.max(0, 1 - this.drag[i] * dt);
      this.vx[i] *= d;
      this.vy[i] *= d;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
      const size = this.size[i] * (1 + (this.grow[i] - 1) * (1 - k));
      let sx = size;
      let sy = size;
      let angle = 0;
      if (this.stretch[i] > 0) {
        const sp = Math.hypot(this.vx[i], this.vy[i]);
        sx = size + sp * this.stretch[i];
        sy = size * 0.45;
        angle = Math.atan2(this.vy[i], this.vx[i]);
      }
      this.q.setFromAxisAngle(this.axis, angle);
      this.p.set(this.x[i], this.y[i], this.z[i]);
      this.s.set(sx, sy, 1);
      this.m.compose(this.p, this.q, this.s);
      this.mesh.setMatrixAt(i, this.m);
      this.mesh.setColorAt(i, this.colors[i]);
      this.alphaAttr.setX(i, this.alpha[i] * Math.min(1, k * 2.5));
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    this.alphaAttr.needsUpdate = true;
  }

  clear() {
    this.life.fill(0);
  }
}

export class ParticleSystem {
  readonly group = new THREE.Group();
  private readonly glow: Pool;
  private readonly soft: Pool;
  /** Scales spawn counts (reduced motion → fewer particles). */
  density = 1;

  constructor() {
    const tex = softDot();
    this.glow = new Pool(true, tex);
    this.soft = new Pool(false, tex);
    this.group.add(this.soft.mesh, this.glow.mesh);
  }

  spawn(p: ParticleSpec) {
    (p.additive ? this.glow : this.soft).spawn(p);
  }

  burst(n: number, make: (i: number) => ParticleSpec) {
    const count = Math.max(1, Math.round(n * this.density));
    for (let i = 0; i < count; i++) this.spawn(make(i));
  }

  update(dt: number) {
    this.glow.update(dt);
    this.soft.update(dt);
  }

  clear() {
    this.glow.clear();
    this.soft.clear();
  }
}
