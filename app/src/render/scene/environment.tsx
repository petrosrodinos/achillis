import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneState } from '@/core/engine/engine-types';
import type { EnvId, GroundMaterial } from '@/content/ids';

/**
 * Parallax background (spec §5: sky → mountains → hills → fog → foreground terrain) and the
 * gameplay ground. Layers follow the camera and scroll their textures at different speeds.
 */

const IMG = '/assets/images';
const loader = new THREE.TextureLoader();
const texCache = new Map<string, THREE.Texture>();

/** Dark tone per env used for fallbacks while images load (or if missing). */
const FALLBACK: Partial<Record<EnvId, [string, string]>> = {
  'dark-hallway': ['#1b1820', '#2c2630'],
  'mirror-hall': ['#1d1a26', '#302a3a'],
  'grand-hall': ['#241d1a', '#3a2e26'],
  'fortress-halls': ['#1f1c1a', '#34302c'],
  'fortress-dungeon': ['#161412', '#2a2420'],
  'storm-zone': ['#3a3f48', '#5a606a'],
  'dark-tower': ['#2e2a36', '#5a5060'],
};

function gradientTexture(top: string, bottom: string): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const EMPTY = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 2;
  const t = new THREE.CanvasTexture(c);
  return t;
})();

function texture(url: string, repeat: boolean, onLoad?: () => void): THREE.Texture {
  let t = texCache.get(url);
  if (!t) {
    t = loader.load(url, () => onLoad?.(), undefined, () => console.warn(`[env] missing ${url}`));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeat) {
      t.wrapS = THREE.MirroredRepeatWrapping;
      t.wrapT = THREE.MirroredRepeatWrapping;
    } else {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
    }
    texCache.set(url, t);
  }
  return t;
}

/** Preload a mission's environment textures behind the briefing/loading screen. */
export function preloadEnvironment(envs: EnvId[], grounds: GroundMaterial[]): Promise<void> {
  const urls = [
    ...envs.flatMap((e) => ['sky', 'far', 'mid', 'fore'].map((l) => `${IMG}/env/${e}/${l}.webp`)),
    ...grounds.map((g) => `${IMG}/ground/${g}.webp`),
    ...['light', 'dark', 'storm'].map((f) => `${IMG}/env/_fog/${f}.webp`),
  ];
  return Promise.all(
    urls.map(
      (u) =>
        new Promise<void>((resolve) => {
          if (texCache.has(u)) return resolve();
          const t = loader.load(u, () => resolve(), undefined, () => resolve());
          t.colorSpace = THREE.SRGBColorSpace;
          t.wrapS = u.includes('/ground/') ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
          t.wrapT = u.includes('/ground/') ? THREE.MirroredRepeatWrapping : THREE.ClampToEdgeWrapping;
          t.anisotropy = 4;
          texCache.set(u, t);
        }),
    ),
  ).then(() => undefined);
}

interface LayerSpec {
  key: 'sky' | 'far' | 'mid' | 'fog' | 'fore';
  /** Height in world metres; width is 2× (images are 2:1). */
  height: number;
  /** Bottom edge relative to the camera's ground line. */
  bottom: number;
  /** 0 = fixed to camera (infinitely far), 1 = moves with the world. */
  factor: number;
  z: number;
  opacity?: number;
}

const LAYERS: LayerSpec[] = [
  { key: 'sky', height: 16, bottom: -3, factor: 0.03, z: -60 },
  { key: 'far', height: 8.5, bottom: -0.2, factor: 0.12, z: -50 },
  { key: 'mid', height: 7, bottom: -0.4, factor: 0.3, z: -40 },
  { key: 'fog', height: 5, bottom: 0.2, factor: 0.45, z: -35, opacity: 0.65 },
  { key: 'fore', height: 3.6, bottom: 0.15, factor: 0.75, z: -20 },
];

interface Props {
  scene: () => SceneState | null;
}

/** Must match GROUND_FRACTION in game-canvas: the camera centre sits this high above the ground at rest. */
const REST_FRACTION = 0.34;

export function Environment({ scene }: Props) {
  const { camera, size } = useThree();
  const layerRefs = useRef<Array<THREE.Mesh | null>>([]);
  const groundRef = useRef<THREE.Mesh>(null);
  const fadeRef = useRef<THREE.Mesh>(null);
  const current = useRef<{ env: EnvId | null; ground: GroundMaterial | null; fog: string | null; surface: string | null }>({ env: null, ground: null, fog: null, surface: null });

  const layerMats = useMemo(
    () => LAYERS.map((l) => new THREE.MeshBasicMaterial({ map: EMPTY, transparent: l.key !== 'sky', depthWrite: false, opacity: l.opacity ?? 1, toneMapped: false })),
    [],
  );
  const groundMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ map: EMPTY, roughness: 0.95, metalness: 0, color: '#d8cfc2' });
    // Depth shading baked into the ground: a soft haze where it meets the backdrop and a darker near edge.
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = 'varying float vWy;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWy = (modelMatrix * vec4(transformed, 1.0)).y;');
      sh.fragmentShader =
        'varying float vWy;\n' +
        sh.fragmentShader.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
  float wkT = clamp((1.15 - vWy) / 4.0, 0.0, 1.0);
  gl_FragColor.rgb *= mix(0.72, 1.0, smoothstep(0.0, 0.1, wkT)) * mix(1.0, 0.62, smoothstep(0.4, 1.0, wkT));`,
        );
    };
    return m;
  }, []);
  const surfaceMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uCamX: { value: 0 }, uMode: { value: 0 } },
        vertexShader: /* glsl */ `varying vec2 vUv; varying vec3 vWorld; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uMode; varying vec2 vUv; varying vec3 vWorld;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
          void main(){
            vec2 p = vec2(vWorld.x * 0.35, vWorld.y * 1.4);
            float n = noise(p + vec2(uTime*0.25, 0.0)) * 0.6 + noise(p*2.3 - vec2(uTime*0.4, uTime*0.1)) * 0.4;
            vec3 col;
            if (uMode < 0.5) {
              // Sea
              vec3 deep = vec3(0.13, 0.22, 0.27), lite = vec3(0.36, 0.48, 0.52);
              col = mix(deep, lite, smoothstep(0.35, 0.85, n));
              col += vec3(0.9) * smoothstep(0.82, 0.95, n) * 0.25;
            } else {
              // Clouds
              vec3 a = vec3(0.62, 0.62, 0.66), b = vec3(0.92, 0.9, 0.88);
              col = mix(a, b, smoothstep(0.2, 0.9, n));
            }
            col *= mix(0.75, 1.0, vUv.y);
            gl_FragColor = vec4(col, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  const fadeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0, depthTest: false, depthWrite: false }), []);

  useEffect(() => () => {
    layerMats.forEach((m) => m.dispose());
    groundMat.dispose();
    surfaceMat.dispose();
    fadeMat.dispose();
  }, [layerMats, groundMat, surfaceMat, fadeMat]);

  useFrame((state) => {
    const s = scene();
    if (!s) return;
    const cam = camera as THREE.OrthographicCamera;
    const viewH = (cam.top - cam.bottom) / cam.zoom;
    const viewW = (cam.right - cam.left) / cam.zoom;
    const camX = cam.position.x;
    const camY = cam.position.y;
    const groundLine = 0;
    const restCamY = REST_FRACTION * viewH;

    // Swap textures when the environment changes.
    const cur = current.current;
    if (cur.env !== s.env || cur.fog !== s.fog) {
      cur.env = s.env;
      cur.fog = s.fog;
      LAYERS.forEach((l, i) => {
        const url = l.key === 'fog' ? `${IMG}/env/_fog/${s.fog}.webp` : `${IMG}/env/${s.env}/${l.key}.webp`;
        const t = texture(url, false);
        layerMats[i].map = t;
        if (l.key === 'sky') {
          const fb = FALLBACK[s.env] ?? ['#8fa2b0', '#d9cbb0'];
          // Gradient placeholder behind the sky until the image is decoded.
          layerMats[i].map = t.image ? t : gradientTexture(fb[0], fb[1]);
          if (!t.image) {
            const check = () => {
              if (t.image) layerMats[i].map = t;
              layerMats[i].needsUpdate = true;
            };
            setTimeout(check, 400);
            setTimeout(check, 1500);
            setTimeout(check, 4000);
          }
        }
        layerMats[i].needsUpdate = true;
      });
    }
    if (cur.ground !== s.ground) {
      cur.ground = s.ground;
      const t = texture(`${IMG}/ground/${s.ground}.webp`, true);
      groundMat.map = t;
      groundMat.needsUpdate = true;
    }

    // Parallax layers.
    LAYERS.forEach((l, i) => {
      const mesh = layerRefs.current[i];
      if (!mesh) return;
      const h = l.key === 'sky' ? Math.max(l.height, viewH * 1.25) : l.height;
      const tileW = h * 2;
      const width = viewW + 2;
      mesh.scale.set(width, h, 1);
      // Vertical parallax: distant layers barely move when the camera climbs (flight).
      const dy = (camY - restCamY) * (1 - l.factor);
      const bottom = l.key === 'sky' ? camY - viewH / 2 - 0.5 : groundLine + l.bottom + dy * 0.85 - (s.flight ? 2.5 : 0);
      mesh.position.set(camX, bottom + h / 2, l.z);
      const map = layerMats[i].map;
      if (map) {
        map.repeat.set(width / tileW, 1);
        map.offset.x = ((camX * l.factor) / tileW) % 1;
      }
      mesh.visible = !(s.flight && l.key === 'fore' && s.tint === 'clouds');
    });

    // Ground plane / flight surface.
    const g = groundRef.current;
    if (g) {
      const L = 14;
      const width = viewW + 6;
      g.scale.set(width, L, 1);
      g.position.set(camX, s.flight ? -3.2 : -1.0, -2.4);
      if (s.flight && s.tint !== 'land') {
        g.material = surfaceMat;
        surfaceMat.uniforms.uTime.value = state.clock.elapsedTime;
        surfaceMat.uniforms.uMode.value = s.tint === 'clouds' ? 1 : 0;
      } else {
        g.material = groundMat;
        const map = groundMat.map;
        if (map) {
          map.repeat.set(width / 3.2, L / 3.2);
          map.offset.set((camX / 3.2) % 2, 0); // mirrored repeat has a period of 2
        }
      }
    }

    // Slide transition fade.
    const fm = fadeRef.current;
    if (fm) {
      fm.position.set(camX, camY, 5);
      fm.scale.set(viewW + 2, viewH + 2, 1);
      fadeMat.opacity = s.fade;
      fm.visible = s.fade > 0.001;
    }
  });

  void size;
  return (
    <group>
      {LAYERS.map((l, i) => (
        <mesh key={l.key} ref={(m) => void (layerRefs.current[i] = m)} material={layerMats[i]} renderOrder={-100 + i} frustumCulled={false}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
      <mesh ref={groundRef} rotation={[-1.2, 0, 0]} material={groundMat} renderOrder={-10} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={fadeRef} material={fadeMat} renderOrder={1000} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}
