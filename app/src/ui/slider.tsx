import { useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from './cn';

export interface SliderProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  /** Fired when the user releases the thumb / key (good moment for a preview sound). */
  onCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Format the visible + announced value (defaults to percentage of 0..1). */
  format?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

const pct = (v: number) => `${Math.round(v * 100)}%`;

/**
 * Volume-style slider: native range input (full keyboard + screen-reader support)
 * skinned as a bronze-filled groove with a rondel thumb.
 */
export function Slider({
  label,
  value,
  onChange,
  onCommit,
  min = 0,
  max = 1,
  step = 0.05,
  format = pct,
  disabled,
  className,
}: SliderProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  const text = format(value);
  return (
    <div className={cn('flex flex-col gap-2', disabled && 'opacity-55', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[1.05rem] leading-tight">
          {label}
        </label>
        <output htmlFor={id} className="font-heading text-sm font-bold tabular-nums text-accent-strong in-[.wk-frame--parchment]:text-oxblood-700">
          {text}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={text}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={(e) => onCommit?.(Number((e.target as HTMLInputElement).value))}
        onKeyUp={(e) => onCommit?.(Number((e.target as HTMLInputElement).value))}
        style={{ '--fill': `${fill}%` } as CSSProperties}
        className="wk-range h-7 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
      />
    </div>
  );
}
