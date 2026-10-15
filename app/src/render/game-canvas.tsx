import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '@/core/audio/audio-manager';
import type { GameEngine } from '@/core/engine/engine-types';
import { publishFps, publishHud } from '@/core/hud/hud-store';
import { input } from '@/core/input/input-manager';
import { clamp, damp } from '@/core/math/rng';
import { getSettings } from '@/core/settings/settings-store';
import { OpenFieldEngine } from '@/engines/open-field/open-field-engine';
import { EngineBase } from '@/engines/shared/engine-base';
import { ActorLayer } from './actors/actor-layer';
import { Environment } from './scene/environment';
import { WorldProps } from './scene/world-props';
import { PresentationDirector, type Shake } from './vfx/director';
import { ParticleSystem } from './vfx/particles';

export const FIXED_DT = 1 / 60;
const MAX_STEPS_PER_FRAME = 5;
/** Ground line sits this fraction of the view above the bottom edge (spec §5 layout). */
const GROUND_FRACTION = 0.16;
const DEAD_ZONE = 1.4;

interface DriverProps {
  engine: GameEngine;
  paused: boolean;
  onPause: () => void;
  onFinished: () => void;
}

/** Fixed-timestep loop + camera + presentation. Runs inside the R3F frame loop; no React state per frame. */
function GameDriver({ engine, paused, onPause, onFinished }: DriverProps) {
  const { camera, size, scene: threeScene } = useThree();
  if (import.meta.env.DEV) Object.assign(window as object, { __wkScene: threeScene });
  const particles = useMemo(() => new ParticleSystem(), []);
  const director = useMemo(() => new PresentationDirector(particles), [particles]);
  const state = useRef({ acc: 0, camX: 0, camY: 0, shake: 0, shakeT: 0, shakeDur: 0, finished: false, music: '', ambience: '' as string | null, init: false });

  useEffect(() => {
    director.onShake = (s: Shake) => {
      const st = getSettings();
      if (!st.screenShake || st.reducedMotion) return;
      state.current.shake = Math.max(state.current.shake, s.strength);
      state.current.shakeT = s.duration;
      state.current.shakeDur = s.duration;
    };
    return () => director.dispose();
  }, [director]);

  useEffect(() => {
    particles.density = getSettings().reducedMotion ? 0.45 : 1;
  }, [particles]);

  useFrame((_, rawDelta) => {
    const s = state.current;
    const delta = Math.min(rawDelta, 0.1);
    if (input.consumePause()) onPause();
    const w = engine.world;

    if (!paused) {
      // Hit-stop freezes the simulation briefly on impact (spec §5 Combat Feel).
      if (w.hitStop > 0) {
        w.hitStop = Math.max(0, w.hitStop - delta);
      } else {
        s.acc += delta;
        let steps = 0;
        while (s.acc >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
          engine.step(FIXED_DT);
          input.endStep();
          s.acc -= FIXED_DT;
          steps++;
          if (w.hitStop > 0) {
            s.acc = 0;
            break;
          }
        }
        if (steps === MAX_STEPS_PER_FRAME) s.acc = 0;
      }
    } else {
      input.endStep();
    }

    // Camera: orthographic side view with dead zone and smoothing (spec §6).
    const cam = camera as THREE.OrthographicCamera;
    const hint = engine.camera();
    const viewH = hint.viewHeight;
    const zoom = size.height / viewH;
    cam.zoom = damp(cam.zoom || zoom, zoom, 4, delta);
    const viewW = size.width / cam.zoom;
    const targetY = hint.y + (0.5 - GROUND_FRACTION) * viewH;
    let tx = s.camX;
    if (!s.init) {
      s.camX = hint.x;
      s.camY = targetY;
      s.init = true;
    }
    if (hint.frame) tx = hint.x;
    else if (hint.x > s.camX + DEAD_ZONE) tx = hint.x - DEAD_ZONE;
    else if (hint.x < s.camX - DEAD_ZONE) tx = hint.x + DEAD_ZONE;
    const half = viewW / 2;
    tx = hint.maxX - hint.minX <= viewW ? (hint.minX + hint.maxX) / 2 : clamp(tx, hint.minX + half, hint.maxX - half);
    s.camX = damp(s.camX, tx, hint.frame ? 4 : 5, delta);
    s.camY = damp(s.camY, targetY, 3, delta);
    let sx = 0;
    let sy = 0;
    if (s.shakeT > 0) {
      s.shakeT -= delta;
      const k = s.shake * Math.max(0, s.shakeT / Math.max(0.01, s.shakeDur));
      sx = (Math.random() * 2 - 1) * k;
      sy = (Math.random() * 2 - 1) * k;
    }
    const distortion = engine.scene().distortion;
    if (distortion > 0 && !getSettings().reducedMotion) sy += Math.sin(performance.now() / 90) * 0.04 * distortion;
    cam.position.set(s.camX + sx, s.camY + sy, 50);
    cam.rotation.set(0, 0, 0);
    cam.updateProjectionMatrix();
    audio.setListenerX(s.camX);

    // Open field: world x under the cursor for move orders.
    if (engine instanceof OpenFieldEngine) engine.cursorX = s.camX + input.mouseNdc.x * (viewW / 2);

    // Presentation.
    const scene = engine.scene();
    if (engine instanceof EngineBase) director.process(engine.drainPresentationEvents(), w, scene);
    director.update(paused ? 0 : delta, w, scene, { x: s.camX, y: s.camY, w: viewW, h: viewH });

    const track = engine.soundtrack();
    if (engine.status === 'playing' && track.music !== s.music) {
      s.music = track.music;
      void audio.playMusic(track.music);
    }
    if (track.ambience !== s.ambience) {
      s.ambience = track.ambience;
      void audio.playAmbience(track.ambience);
    }

    publishHud(engine.hud());
    publishFps(rawDelta);
    if (!s.finished && (engine.status === 'victory' || engine.status === 'defeat')) {
      s.finished = true;
      onFinished();
    }
  });

  return <primitive object={particles.group} />;
}

export interface GameCanvasProps {
  engine: GameEngine;
  paused: boolean;
  onPause: () => void;
  onFinished: () => void;
  onContextLost?: (lost: boolean) => void;
}

/** The game viewport: orthographic side camera, soft directional light, all world layers. */
export function GameCanvas({ engine, paused, onPause, onFinished, onContextLost }: GameCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [lost, setLost] = useState(false);
  const worldRef = useRef(engine.world);
  worldRef.current = engine.world;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    input.attach(el);
    // Touch: taps on the playfield only aim (orders); actions come from the on-screen controls.
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (!t) return;
      const r = el.getBoundingClientRect();
      input.mouseNdc.x = ((t.clientX - r.left) / r.width) * 2 - 1;
      input.mouseNdc.y = -(((t.clientY - r.top) / r.height) * 2 - 1);
    };
    el.addEventListener('touchstart', onTouch, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouch);
      input.detach();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 touch-none" aria-label="Game view" role="application">
      <Canvas
        orthographic
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        camera={{ position: [0, 4, 50], zoom: 60, near: 0.1, far: 500 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setLost(true);
            onContextLost?.(true);
          });
          canvas.addEventListener('webglcontextrestored', () => {
            setLost(false);
            onContextLost?.(false);
          });
        }}
      >
        <color attach="background" args={['#14110e']} />
        <hemisphereLight args={['#fff2dc', '#4a3c30', 1.1]} />
        <directionalLight position={[-8, 14, 12]} intensity={2.1} color="#fff0d8" />
        <directionalLight position={[10, 4, 6]} intensity={0.45} color="#c8d4ff" />
        <GameDriver engine={engine} paused={paused || lost} onPause={onPause} onFinished={onFinished} />
        <Environment scene={() => engine.scene()} />
        <WorldProps world={() => worldRef.current} />
        <ActorLayer world={() => worldRef.current} />
      </Canvas>
    </div>
  );
}
