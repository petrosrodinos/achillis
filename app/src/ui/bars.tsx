import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from './cn';
import { useReducedMotion } from './hooks';

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

/**
 * Damage-chip value: lags behind `current` when it drops (so the lost chunk flashes),
 * follows immediately when it rises.
 */
function useChip(current: number, delay = 380): number {
  const reduced = useReducedMotion();
  const [chip, setChip] = useState(current);
  const prev = useRef(current);
  useEffect(() => {
    const dropped = current < prev.current;
    prev.current = current;
    const t = window.setTimeout(() => setChip(current), dropped && !reduced ? delay : 0);
    return () => window.clearTimeout(t);
  }, [current, delay, reduced]);
  return Math.max(chip, current);
}

export type HealthTone = 'health' | 'ally' | 'enemy' | 'mount';

const toneFill: Record<HealthTone, string> = {
  health: 'linear-gradient(180deg,#e2715d 0%,#b8382d 45%,#7f2420 100%)',
  enemy: 'linear-gradient(180deg,#c76452 0%,#9b2f29 45%,#5e1a17 100%)',
  ally: 'linear-gradient(180deg,#a7c98c 0%,#5f8a48 45%,#34502a 100%)',
  mount: 'linear-gradient(180deg,#d9b27a 0%,#a8773d 45%,#6e4a22 100%)',
};

export interface SegmentedHealthBarProps {
  current: number;
  max: number;
  /** Number of blocks: 4 player (100 HP), 6 mounted (150), 3 / 5 units (75 / 125). */
  segments: number;
  tone?: HealthTone;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name, e.g. "White Knight health". */
  label?: string;
  /** Show "75 / 100" next to the bar. */
  showValue?: boolean;
  className?: string;
}

const segH = { sm: 'h-2.5', md: 'h-4', lg: 'h-5' } as const;
const segW = { sm: 'w-5', md: 'w-10', lg: 'w-14' } as const;

/**
 * Block-based health bar. Each block holds max/segments HP and drains left→right-most first;
 * lost health flashes as a pale "chip" before shrinking. Pulses when ≤ 25%.
 */
export function SegmentedHealthBar({
  current,
  max,
  segments,
  tone = 'health',
  size = 'md',
  label = 'Health',
  showValue = false,
  className,
}: SegmentedHealthBarProps) {
  const hp = Math.max(0, Math.min(max, current));
  const chip = useChip(hp);
  const per = max / Math.max(1, segments);
  const low = hp > 0 && hp / max <= 0.25;
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(hp)}
        className={cn('flex gap-[3px]', low && 'animate-pulse-soft')}
      >
        {Array.from({ length: segments }, (_, i) => {
          const fill = clamp01((hp - i * per) / per);
          const chipFill = clamp01((chip - i * per) / per);
          return (
            <div
              key={i}
              className={cn(
                'relative overflow-hidden rounded-[2px] border-2 border-[#0b0807] bg-[linear-gradient(180deg,#120e0b,#2a221b)] shadow-[0_1px_0_rgb(255_230_190/0.12),inset_0_2px_3px_rgb(0_0_0/0.8)]',
                segH[size],
                segW[size],
              )}
            >
              <div
                className="absolute inset-y-0 left-0 bg-health-chip/90 transition-[width] duration-300 ease-out"
                style={{ width: `${chipFill * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]"
                style={{ width: `${fill * 100}%`, background: toneFill[tone] }}
              />
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="wk-hud-numeral text-[0.85rem] tabular-nums">
          {Math.ceil(hp)}
          <span className="text-parchment-300"> / {max}</span>
        </span>
      )}
    </div>
  );
}

export interface BossHealthBarProps {
  name: string;
  current: number;
  max: number;
  /** Optional subtitle, e.g. "Round 2 · On foot". */
  subtitle?: ReactNode;
  /** Phase thresholds as fractions of max (e.g. [0.66, 0.33]) drawn as notches. */
  phases?: number[];
  className?: string;
}

/** Large ornate boss bar for the top of the screen: name plate, chip animation, phase notches. */
export function BossHealthBar({ name, current, max, subtitle, phases = [], className }: BossHealthBarProps) {
  const hp = Math.max(0, Math.min(max, current));
  const chip = useChip(hp, 500);
  const pct = clamp01(hp / max);
  return (
    <div className={cn('w-full max-w-3xl', className)}>
      <div className="mb-1 flex items-end justify-between px-1">
        <span className="wk-hud-text font-display text-lg md:text-xl">{name}</span>
        {subtitle && <span className="wk-hud-label">{subtitle}</span>}
      </div>
      <div
        role="progressbar"
        aria-label={`${name} health`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(hp)}
        className="wk-frame wk-frame--bronze relative h-7 !rounded-[4px] !border-[3px] p-0 !shadow-[0_6px_18px_-4px_rgb(0_0_0/0.9)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[1px] bg-[linear-gradient(180deg,#0b0807,#221a14)]">
          <div className="absolute inset-y-0 left-0 bg-health-chip/85 transition-[width] duration-500 ease-out" style={{ width: `${clamp01(chip / max) * 100}%` }} />
          <div
            className="absolute inset-y-0 left-0 shadow-[inset_0_2px_0_rgb(255_255_255/0.3),inset_0_-3px_0_rgb(0_0_0/0.35)]"
            style={{ width: `${pct * 100}%`, background: 'linear-gradient(180deg,#e2715d 0%,#a8322a 50%,#5e1a17 100%)' }}
          />
          {phases.map((p) => (
            <div key={p} aria-hidden="true" className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#0b0807] shadow-[1px_0_0_rgb(255_220_160/0.3)]" style={{ left: `${clamp01(p) * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export interface ManaBarProps {
  current: number;
  max: number;
  label?: string;
  /** Show the label text above the bar. */
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/** Arcane-violet mana bar (bosses such as the Wizard / Witch). One of the few saturated UI elements. */
export function ManaBar({ current, max, label = 'Mana', showLabel = true, size = 'md', className }: ManaBarProps) {
  const v = Math.max(0, Math.min(max, current));
  const chip = useChip(v);
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between">
          <span className="wk-hud-label !text-arcane-soft">{label}</span>
          <span className="wk-hud-label tabular-nums">{Math.ceil(v)} / {max}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(v)}
        className={cn(
          'relative overflow-hidden rounded-full border-2 border-[#0b0807] bg-[linear-gradient(180deg,#0e0a14,#1d1628)] shadow-[0_0_10px_rgb(139_92_246/0.35),inset_0_2px_3px_rgb(0_0_0/0.8)]',
          size === 'sm' ? 'h-2.5' : 'h-4',
        )}
      >
        <div className="absolute inset-y-0 left-0 bg-arcane-soft/60 transition-[width] duration-300" style={{ width: `${clamp01(chip / max) * 100}%` }} />
        <div
          className="absolute inset-y-0 left-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.45)]"
          style={{ width: `${clamp01(v / max) * 100}%`, background: 'linear-gradient(180deg,#c4b0ff 0%,#8b5cf6 45%,#4c2a9e 100%)' }}
        />
      </div>
    </div>
  );
}

export interface XpBarProps {
  /** XP earned within the current level. */
  xpIntoLevel: number;
  /** XP needed to reach the next level from the start of this one. */
  xpForNextLevel: number;
  level?: number;
  className?: string;
  /** Show "1,200 / 3,000 XP" caption. */
  showCaption?: boolean;
}

/** Thin gilded experience bar. */
export function XpBar({ xpIntoLevel, xpForNextLevel, level, className, showCaption = true }: XpBarProps) {
  const pct = xpForNextLevel > 0 ? clamp01(xpIntoLevel / xpForNextLevel) : 1;
  const fmt = (n: number) => n.toLocaleString('en-GB');
  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-label={level ? `Experience towards level ${level + 1}` : 'Experience'}
        aria-valuemin={0}
        aria-valuemax={xpForNextLevel}
        aria-valuenow={xpIntoLevel}
        aria-valuetext={`${fmt(xpIntoLevel)} of ${fmt(xpForNextLevel)} XP`}
        className="relative h-3 overflow-hidden rounded-full border-2 border-[#0b0807] bg-[linear-gradient(180deg,#120e0b,#2a221b)] shadow-[inset_0_2px_3px_rgb(0_0_0/0.8)]"
      >
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-[var(--ease-weighty)]"
          style={{ width: `${pct * 100}%`, background: 'linear-gradient(180deg,#f6dc95 0%,#c9a54a 50%,#7a5a1e 100%)' }}
        />
        <div className="wk-shimmer absolute inset-0 opacity-60" />
      </div>
      {showCaption && (
        <p className="mt-1 text-right font-heading text-[0.75rem] font-bold tracking-wider text-fg-muted tabular-nums in-[.wk-frame--parchment]:text-ink-muted">
          {fmt(xpIntoLevel)} / {fmt(xpForNextLevel)} XP
        </p>
      )}
    </div>
  );
}

export interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeSize = { sm: 'size-9 text-sm', md: 'size-12 text-lg', lg: 'size-20 text-3xl' } as const;

/** Heater-shield badge showing the player's level. */
export function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', badgeSize[size], className)}
      role="img"
      aria-label={`Level ${level}`}
    >
      <svg viewBox="0 0 40 46" className="absolute inset-0 size-full drop-shadow-[0_3px_3px_rgb(0_0_0/0.7)]" aria-hidden="true">
        <defs>
          <linearGradient id="wk-badge-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dcae" />
            <stop offset="0.45" stopColor="#a8773d" />
            <stop offset="1" stopColor="#4f3417" />
          </linearGradient>
          <linearGradient id="wk-badge-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7f2420" />
            <stop offset="1" stopColor="#3a0f0d" />
          </linearGradient>
        </defs>
        <path d="M20 1.5 37.5 6v14c0 12-8 20-17.5 24.5C10.5 40 2.5 32 2.5 20V6z" fill="url(#wk-badge-rim)" stroke="#120c06" strokeWidth="1.5" />
        <path d="M20 5.5 34 9v11c0 9.6-6.3 16.2-14 20-7.7-3.8-14-10.4-14-20V9z" fill="url(#wk-badge-face)" />
      </svg>
      <span className="relative -mt-[8%] font-heading font-black tabular-nums text-parchment-50 [text-shadow:0_1px_0_#000]">{level}</span>
    </span>
  );
}
