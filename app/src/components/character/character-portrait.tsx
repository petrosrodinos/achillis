import type { CharacterId } from '@/content/ids';
import { CHARACTERS } from '@/content/characters';
import { ArtImage, IconLock, cn } from '@/ui';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

export interface CharacterPortraitProps {
  id: CharacterId;
  locked?: boolean;
  /** Hint shown when locked. */
  lockHint?: string;
  selected?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/** Bust portrait in an iron/bronze frame with name plate; greyed + lock when locked. */
export function CharacterPortrait({ id, locked, lockHint, selected, size = 'md', className }: CharacterPortraitProps) {
  const c = CHARACTERS[id];
  return (
    <div
      className={cn(
        'wk-frame flex h-full flex-col overflow-hidden !p-0 transition-[transform,filter] duration-200',
        selected && 'wk-frame--bronze ring-2 ring-bronze-300 ring-offset-2 ring-offset-night-950',
        className,
      )}
    >
      <ArtImage
        src={c.portrait}
        alt=""
        fallback="portrait"
        dimmed={locked}
        className="aspect-square w-full"
        placeholder={<span className="font-display text-4xl font-black text-iron-300/70">{initials(c.name)}</span>}
      />
      <div className={cn('flex flex-1 flex-col px-2.5 pb-2 pt-1.5', size === 'sm' && 'px-2 pb-1.5 pt-1')}>
        <span className={cn('font-heading font-bold leading-tight', size === 'sm' ? 'text-[0.78rem]' : 'text-[0.95rem]', locked ? 'text-fg-subtle' : 'text-parchment-50')}>
          {c.name}
        </span>
        {c.alias && !locked && <span className="text-[0.85rem] italic leading-tight text-fg-muted">{c.alias}</span>}
        {locked && lockHint && (
          <span className="mt-0.5 flex items-start gap-1 text-[0.82rem] leading-tight text-fg-muted">
            <IconLock size={12} className="mt-0.5 shrink-0" /> {lockHint}
          </span>
        )}
      </div>
    </div>
  );
}
