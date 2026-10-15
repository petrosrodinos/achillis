import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

/**
 * HUD primitives for the in-game overlay (the lead composes the actual HUD).
 * All are pointer-events: none by default so they never steal clicks from the canvas;
 * opt back in with `interactive`.
 */

export interface HudLayerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Full-screen overlay positioned over the canvas, with a top band of 20% viewport height
 * (spec §5 Screen Layout). Place HudCorner children inside.
 */
export function HudLayer({ className, children, ...rest }: HudLayerProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 z-10 select-none', className)} {...rest}>
      {children}
    </div>
  );
}

export type HudPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

const posClass: Record<HudPosition, string> = {
  'top-left': 'left-4 top-3 items-start text-left',
  'top-center': 'left-1/2 top-3 -translate-x-1/2 items-center text-center',
  'top-right': 'right-4 top-3 items-end text-right',
  'bottom-left': 'bottom-4 left-4 items-start text-left',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center text-center',
  'bottom-right': 'bottom-4 right-4 items-end text-right',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center',
};

export interface HudCornerProps extends HTMLAttributes<HTMLDivElement> {
  position: HudPosition;
  /** Re-enable pointer events (e.g. a pause button). */
  interactive?: boolean;
  /** Draw a subtle dark scrim behind the group for legibility on bright skies. */
  scrim?: boolean;
}

/** Anchors a vertical stack of HUD elements to a screen corner / edge. */
export function HudCorner({ position, interactive, scrim, className, ...rest }: HudCornerProps) {
  return (
    <div
      className={cn(
        'absolute flex max-w-[34vw] flex-col gap-1.5',
        posClass[position],
        interactive && 'pointer-events-auto',
        scrim && 'rounded-[6px] bg-[radial-gradient(closest-side,rgb(5_4_3/0.55),transparent)] px-4 py-2',
        className,
      )}
      {...rest}
    />
  );
}

export interface HudStatProps {
  label?: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Emphasise (larger numeral) — e.g. the kill counter in the top centre. */
  large?: boolean;
  className?: string;
}

/** Icon + numeral (+ optional label) e.g. lives ×3, enemies 12, kills 37. */
export function HudStat({ label, value, icon, large, className }: HudStatProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {icon && <span className="text-parchment-100 drop-shadow-[0_1px_1px_#000]">{icon}</span>}
      <div className="flex flex-col leading-none">
        {label && <span className="wk-hud-label">{label}</span>}
        <span className={cn('wk-hud-numeral', large ? 'text-4xl' : 'text-xl')}>{value}</span>
      </div>
    </div>
  );
}

/** Player / unit name in HUD styling. */
export function HudName({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('wk-hud-text text-lg', className)}>{children}</span>;
}

/** Small caps label in HUD styling (e.g. "Mission III · Stage 2/3"). */
export function HudLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('wk-hud-label', className)}>{children}</span>;
}

/** Big centred announcement ("Round 2", "Victory") — slams in. */
export function HudBanner({ children, sub, className }: { children: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex animate-slam-in flex-col items-center gap-2', className)} role="status" aria-live="assertive">
      <span className="wk-gilded text-5xl font-black md:text-6xl">{children}</span>
      {sub && <span className="wk-hud-label text-sm">{sub}</span>}
    </div>
  );
}
