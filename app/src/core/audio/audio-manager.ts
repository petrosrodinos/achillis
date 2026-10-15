import { getSettings, useSettingsStore } from '@/core/settings/settings-store';

/**
 * Central audio manager (WebAudio). Loads assets/audio/manifest.json, decodes sounds lazily,
 * mixes three buses (music / ambience / sfx) under a master gain, and supports positional panning
 * for in-world sounds. A small synthesised fallback covers any sound missing from the manifest.
 */

interface Manifest {
  sfx: Record<string, { variants: string[] }>;
  music: Record<string, { src: string; loop?: boolean }>;
}

export interface PlayOptions {
  volume?: number;
  /** World x of the sound source; panned relative to the listener. */
  x?: number;
  /** Random pitch variation (0.06 = ±6%). */
  pitchJitter?: number;
  rate?: number;
}

const BASE = '/assets/audio/';
const MAX_CONCURRENT_PER_SOUND = 6;

class AudioManager {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private ambBus!: GainNode;
  private sfxBus!: GainNode;
  private manifest: Manifest | null = null;
  private manifestPromise: Promise<Manifest | null> | null = null;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private ext: 'ogg' | 'mp3' = 'mp3';
  private listenerX = 0;
  private active = new Map<string, number>();
  private music: { name: string; source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private ambience: { name: string; source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private loops = new Map<string, { source: AudioBufferSourceNode; gain: GainNode }>();
  private lastPlayed = new Map<string, number>();
  private pendingMusic: string | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    const probe = document.createElement('audio');
    this.ext = probe.canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' : 'mp3';
    useSettingsStore.subscribe(() => this.applyVolumes());
    const unlock = () => {
      this.ensureContext();
      if (this.ctx?.state === 'suspended') void this.ctx.resume();
    };
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      this.ctx = new AudioContext({ latencyHint: 'interactive' });
    } catch {
      return null;
    }
    this.master = this.ctx.createGain();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.ratio.value = 4;
    this.master.connect(comp).connect(this.ctx.destination);
    this.musicBus = this.ctx.createGain();
    this.ambBus = this.ctx.createGain();
    this.sfxBus = this.ctx.createGain();
    this.musicBus.connect(this.master);
    this.ambBus.connect(this.master);
    this.sfxBus.connect(this.master);
    this.applyVolumes();
    void this.loadManifest();
    if (this.pendingMusic) {
      const name = this.pendingMusic;
      this.pendingMusic = null;
      void this.playMusic(name);
    }
    return this.ctx;
  }

  private applyVolumes() {
    if (!this.ctx) return;
    const s = getSettings();
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(s.masterVolume, t, 0.05);
    this.musicBus.gain.setTargetAtTime(s.musicVolume * 0.55, t, 0.05);
    this.ambBus.gain.setTargetAtTime(s.musicVolume * 0.45, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(s.sfxVolume, t, 0.05);
  }

  loadManifest(): Promise<Manifest | null> {
    if (!this.manifestPromise) {
      this.manifestPromise = fetch(`${BASE}manifest.json`)
        .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
        .then((m) => (this.manifest = m))
        .catch(() => null);
    }
    return this.manifestPromise;
  }

  private srcFor(path: string): string {
    // Manifest paths reference .ogg; swap to the supported extension.
    return BASE + path.replace(/\.(ogg|mp3)$/i, `.${this.ext}`);
  }

  private loadBuffer(path: string): Promise<AudioBuffer | null> {
    const ctx = this.ensureContext();
    if (!ctx) return Promise.resolve(null);
    let p = this.buffers.get(path);
    if (!p) {
      p = fetch(this.srcFor(path))
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`audio ${path} ${r.status}`))))
        .then((data) => ctx.decodeAudioData(data))
        .catch(() => null);
      this.buffers.set(path, p);
    }
    return p;
  }

  /** Preload the given sfx names (all variants) and music tracks. */
  async preload(sfx: string[], music: string[] = []): Promise<void> {
    const m = await this.loadManifest();
    if (!m || !this.ensureContext()) return;
    const paths: string[] = [];
    for (const n of sfx) paths.push(...(m.sfx[n]?.variants ?? []));
    for (const n of music) if (m.music[n]) paths.push(m.music[n].src);
    await Promise.all(paths.map((p) => this.loadBuffer(p)));
  }

  setListenerX(x: number) {
    this.listenerX = x;
  }

  /** Fire-and-forget sound effect. */
  play(name: string, opts: PlayOptions = {}): void {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;
    // Debounce identical sounds within 25 ms (e.g. many arrows impacting at once).
    const now = performance.now();
    if ((this.lastPlayed.get(name) ?? 0) > now - 25) return;
    this.lastPlayed.set(name, now);
    if ((this.active.get(name) ?? 0) >= MAX_CONCURRENT_PER_SOUND) return;

    const entry = this.manifest?.sfx[name];
    if (!entry || entry.variants.length === 0) {
      this.synthFallback(name, opts);
      return;
    }
    const path = entry.variants[Math.floor(Math.random() * entry.variants.length)];
    void this.loadBuffer(path).then((buffer) => {
      if (!buffer) {
        this.synthFallback(name, opts);
        return;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const jitter = opts.pitchJitter ?? 0.05;
      src.playbackRate.value = (opts.rate ?? 1) * (1 + (Math.random() * 2 - 1) * jitter);
      const gain = ctx.createGain();
      gain.gain.value = opts.volume ?? 1;
      let node: AudioNode = src.connect(gain);
      if (opts.x !== undefined) {
        const dx = opts.x - this.listenerX;
        const panner = ctx.createStereoPanner();
        panner.pan.value = Math.max(-0.85, Math.min(0.85, dx / 12));
        // Distance attenuation beyond the visible area.
        gain.gain.value *= Math.max(0.15, 1 - Math.max(0, Math.abs(dx) - 9) / 25);
        node = node.connect(panner);
      }
      node.connect(this.sfxBus);
      this.active.set(name, (this.active.get(name) ?? 0) + 1);
      src.onended = () => this.active.set(name, Math.max(0, (this.active.get(name) ?? 1) - 1));
      src.start();
    });
  }

  /** Start (or keep) a named looping SFX, e.g. 'low-health' or 'horse-gallop'. */
  startLoop(name: string, volume = 1): void {
    const ctx = this.ensureContext();
    if (!ctx || this.loops.has(name)) return;
    const path = this.manifest?.sfx[name]?.variants[0] ?? this.manifest?.music[name]?.src;
    if (!path) return;
    const placeholder = { source: ctx.createBufferSource(), gain: ctx.createGain() };
    this.loops.set(name, placeholder);
    void this.loadBuffer(path).then((buffer) => {
      if (!buffer || this.loops.get(name) !== placeholder) return;
      placeholder.source.buffer = buffer;
      placeholder.source.loop = true;
      placeholder.gain.gain.value = 0;
      placeholder.gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.15);
      placeholder.source.connect(placeholder.gain).connect(this.sfxBus);
      placeholder.source.start();
    });
  }

  stopLoop(name: string): void {
    const loop = this.loops.get(name);
    if (!loop || !this.ctx) return;
    this.loops.delete(name);
    loop.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    try {
      loop.source.stop(this.ctx.currentTime + 0.6);
    } catch {
      // never started
    }
  }

  stopAllLoops(): void {
    for (const name of [...this.loops.keys()]) this.stopLoop(name);
  }

  private async crossfadeTrack(kind: 'music' | 'ambience', name: string | null, fade = 1.2) {
    const ctx = this.ensureContext();
    if (!ctx) {
      if (kind === 'music') this.pendingMusic = name;
      return;
    }
    const current = kind === 'music' ? this.music : this.ambience;
    if (current?.name === name) return;
    if (current) {
      current.gain.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
      const old = current.source;
      setTimeout(() => {
        try {
          old.stop();
        } catch {
          // already stopped
        }
      }, fade * 1500);
    }
    if (kind === 'music') this.music = null;
    else this.ambience = null;
    if (!name) return;
    const m = await this.loadManifest();
    const track = m?.music[name];
    if (!track) return;
    const buffer = await this.loadBuffer(track.src);
    if (!buffer) return;
    // A newer request may have superseded this one while loading.
    const latest = kind === 'music' ? this.music : this.ambience;
    if (latest) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = track.loop !== false;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(1, ctx.currentTime, fade / 3);
    source.connect(gain).connect(kind === 'music' ? this.musicBus : this.ambBus);
    source.start();
    const handle = { name, source, gain };
    if (kind === 'music') this.music = handle;
    else this.ambience = handle;
  }

  playMusic(name: string | null, fade?: number) {
    return this.crossfadeTrack('music', name, fade);
  }

  playAmbience(name: string | null, fade?: number) {
    return this.crossfadeTrack('ambience', name, fade);
  }

  /** Duck the music (e.g. while paused or on hit-stop). */
  duck(amount: number) {
    if (!this.ctx) return;
    const s = getSettings();
    this.musicBus.gain.setTargetAtTime(s.musicVolume * 0.55 * amount, this.ctx.currentTime, 0.1);
  }

  /** Minimal synthesised fallback so no action is ever silent if an asset is missing. */
  private synthFallback(name: string, opts: PlayOptions) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(this.sfxBus);
    const vol = 0.25 * (opts.volume ?? 1);
    const isUi = name.startsWith('ui-');
    const isHit = /hit|block|parry|impact|clank/.test(name);
    if (isUi || !isHit) {
      const osc = ctx.createOscillator();
      osc.type = isUi ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(isUi ? 660 : 180, t);
      osc.frequency.exponentialRampToValueAtTime(isUi ? 880 : 60, t + 0.12);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + 0.16);
    } else {
      const len = Math.floor(ctx.sampleRate * 0.12);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = name.includes('block') ? 2500 : 900;
      gain.gain.value = vol * 2;
      src.connect(filter).connect(gain);
      src.start(t);
    }
  }
}

export const audio = new AudioManager();

/** Convenience for UI components. */
export const playUiSound = (name: 'ui-click' | 'ui-hover' | 'ui-confirm' | 'ui-back' | 'ui-error' | 'ui-toggle' | 'ui-type' | 'page-turn' | 'unlock' | 'points' | 'level-up') =>
  audio.play(name, { volume: name === 'ui-hover' ? 0.35 : 0.7, pitchJitter: 0.03 });
