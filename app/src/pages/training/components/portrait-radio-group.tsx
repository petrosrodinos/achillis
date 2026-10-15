import { useRef } from 'react';
import type { CharacterId } from '@/content/ids';
import { CHARACTERS } from '@/content/characters';
import { CharacterPortrait } from '@/components/character/character-portrait';
import { uiSound } from '@/ui';

interface Props {
  label: string;
  options: CharacterId[];
  value: CharacterId;
  onChange: (id: CharacterId) => void;
}

/** Portrait grid behaving as a radio group: arrow keys move + select, roving tabindex. */
export function PortraitRadioGroup({ label, options, value, onChange }: Props) {
  const refs = useRef(new Map<CharacterId, HTMLButtonElement>());
  const pick = (id: CharacterId) => {
    if (id !== value) uiSound('ui-toggle');
    onChange(id);
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-2.5"
      onKeyDown={(e) => {
        const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!delta) return;
        e.preventDefault();
        const idx = options.indexOf(value);
        const next = options[(idx + delta + options.length) % options.length];
        pick(next);
        refs.current.get(next)?.focus();
      }}
    >
      {options.map((id) => {
        const selected = id === value;
        return (
          <button
            key={id}
            ref={(el) => {
              if (el) refs.current.set(id, el);
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${CHARACTERS[id].name}${CHARACTERS[id].alias ? `, ${CHARACTERS[id].alias}` : ''}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => pick(id)}
            onMouseEnter={() => !selected && uiSound('ui-hover')}
            className="rounded-[6px] text-left transition-transform duration-150 hover:-translate-y-0.5"
          >
            <CharacterPortrait id={id} selected={selected} size="sm" />
          </button>
        );
      })}
    </div>
  );
}
