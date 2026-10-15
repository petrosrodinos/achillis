import { useCallback, useEffect, useRef, useState } from 'react';
import type { StoryLine } from '@/missions/catalog';
import { cn } from './cn';
import { IconChevronRight } from './icons';
import { uiSound, useReducedMotion } from './hooks';
import { Button } from './button';

export interface DialogueBoxProps {
  lines: readonly StoryLine[];
  /** Called after the last line is dismissed (or on "Skip all"). */
  onDone?: () => void;
  /** Characters per second for the typewriter (default 55). Reduced motion shows text instantly. */
  speed?: number;
  /** Show the "Skip all" control. */
  allowSkipAll?: boolean;
  /** Label for the final advance button. */
  doneLabel?: string;
  /** Capture Enter / Space globally to advance (default true). Disable when another control needs them. */
  captureKeys?: boolean;
  className?: string;
}

/**
 * Parchment story box: speaker plate, typewriter text (click / Enter / Space completes the line,
 * then advances), progress pips and a full-text caption for assistive tech.
 */
export function DialogueBox({
  lines,
  onDone,
  speed = 55,
  allowSkipAll = true,
  doneLabel = 'Continue',
  captureKeys = true,
  className,
}: DialogueBoxProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const line = lines[Math.min(index, lines.length - 1)];
  const full = line?.text ?? '';
  const complete = reduced || shown >= full.length;
  const isLast = index >= lines.length - 1;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduced || !full) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const n = Math.min(full.length, Math.floor(((now - start) / 1000) * speed));
      setShown(n);
      if (n < full.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [full, speed, reduced]);

  const advance = useCallback(() => {
    if (!complete) {
      setShown(full.length);
      return;
    }
    uiSound('page-turn');
    if (isLast) doneRef.current?.();
    else {
      setShown(0);
      setIndex((i) => i + 1);
    }
  }, [complete, full.length, isLast]);

  useEffect(() => {
    if (!captureKeys) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button, a, input, select, textarea, [role="tab"], [role="option"]'))) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, captureKeys]);

  if (!line) return null;
  const visible = complete ? full : full.slice(0, shown);

  return (
    <div className={cn('wk-frame wk-frame--parchment wk-frame--textured wk-frame--bronze wk-rivets relative px-4 pb-4 pt-6 sm:px-6 md:px-8', className)}>
      {line.speaker && (
        <div className="absolute -top-4 left-6 z-[2] rounded-[3px] border-2 border-[#2c1c0b] bg-[linear-gradient(180deg,#7f2420,#4a1513)] px-3.5 py-1 font-heading text-[0.8rem] font-bold uppercase tracking-[0.16em] text-parchment-50 shadow-[0_3px_0_#120705]">
          {line.speaker}
        </div>
      )}
      {/* Caption for assistive tech: the whole line at once. */}
      <p className="sr-only" aria-live="polite">
        {line.speaker ? `${line.speaker}: ` : ''}
        {full}
      </p>
      <div
        aria-hidden="true"
        onClick={advance}
        className="min-h-[5.5rem] cursor-pointer select-none font-body text-[1.2rem] leading-relaxed text-ink md:text-[1.3rem]"
      >
        {!line.speaker && <span className="float-left mr-0.5 font-display text-[2.4rem] leading-[0.9] text-oxblood-700">{visible.charAt(0)}</span>}
        <span className={cn(!line.speaker && 'italic')}>{line.speaker ? visible : visible.slice(1)}</span>
        {!complete && <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse-soft bg-ink/70" />}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" aria-label={`Line ${index + 1} of ${lines.length}`} role="img">
          {lines.map((_, i) => (
            <span key={i} className={cn('size-2 rotate-45 border border-[#5a4328]', i <= index ? 'bg-oxblood-600' : 'bg-transparent')} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {allowSkipAll && !isLast && (
            <Button variant="ghost" size="sm" className="!text-ink-muted hover:!bg-bronze-700/15 hover:!text-ink" onClick={() => doneRef.current?.()}>
              Skip all
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={advance} trailingIcon={<IconChevronRight size={16} />} clickSound={null}>
            {!complete ? 'Show' : isLast ? doneLabel : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
