import { useEffect, useState } from 'react';
import type { MissionCompleteResponse } from '@/api/types';
import { CHARACTERS } from '@/content/characters';
import type { RunOutcome } from '@/core/engine/engine-types';
import { playUiSound } from '@/core/audio/audio-manager';
import type { MissionMeta } from '@/missions/catalog';
import { MISSIONS_BY_ID } from '@/missions/catalog';
import { Button, DialogueBox, Panel, PanelHeader, RankBadge, Spinner, StatTile, XpBar, cn } from '@/ui';

export type SubmitState =
  | { kind: 'pending' }
  | { kind: 'done'; res: MissionCompleteResponse }
  | { kind: 'queued' }
  | { kind: 'offline' }
  | { kind: 'error'; message: string };

interface Props {
  meta: MissionMeta;
  outcome: RunOutcome;
  submit: SubmitState;
  onRetry: () => void;
  onNext: (() => void) | null;
  onMenu: () => void;
}

const fmtTime = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;

export function ResultsScreen({ meta, outcome, submit, onRetry, onNext, onMenu }: Props) {
  const victory = outcome.outcome === 'victory';
  const [storyDone, setStoryDone] = useState(!victory || meta.outro.length === 0);
  const kills = Object.values(outcome.stats.kills).reduce((a, n) => a + (n ?? 0), 0);
  const res = submit.kind === 'done' ? submit.res : null;

  useEffect(() => {
    if (res?.levelUp) playUiSound('level-up');
    else if (res && res.score > 0) playUiSound('points');
    if (res && res.newlyUnlockedCharacters.length > 0) setTimeout(() => playUiSound('unlock'), 700);
  }, [res]);

  if (!storyDone) {
    return (
      <div className="absolute inset-0 z-40 flex items-end justify-center bg-night-950/55 p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:items-center">
        <DialogueBox lines={meta.outro} onDone={() => setStoryDone(true)} doneLabel="See results" className="w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-night-950/70 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="results-title">
      <Panel metal={victory ? 'bronze' : 'oxblood'} className="my-auto w-full max-w-2xl animate-rise-in">
        <PanelHeader eyebrow={`Mission ${meta.number} · ${meta.title}`} title={<span id="results-title">{victory ? 'Victory' : 'Defeat'}</span>} actions={res ? <RankBadge rank={res.rank} /> : undefined} />
        {!victory && outcome.failReason && <p className="mb-3 text-fg-muted">{outcome.failReason}.</p>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile label="Time" value={fmtTime(outcome.durationMs)} />
          <StatTile label="Kills" value={kills} />
          <StatTile label="Perfect blocks" value={outcome.stats.perfectBlocks} />
          <StatTile label="Dodges" value={outcome.stats.dodges} />
        </div>

        <div className="mt-4">
          {submit.kind === 'pending' && (
            <div className="flex items-center gap-2 text-fg-muted">
              <Spinner /> Recording your deeds…
            </div>
          )}
          {submit.kind === 'queued' && <p className="text-fg-muted">You appear to be offline. Your result is saved and will be submitted automatically when the connection returns.</p>}
          {submit.kind === 'offline' && <p className="text-fg-muted">This run was played offline and cannot be scored.</p>}
          {submit.kind === 'error' && <p className="text-danger">{submit.message}</p>}
          {res && victory && (
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-lg text-parchment-100">Score</span>
                <span className="wk-hud-numeral text-3xl text-bronze-200 tabular-nums">{res.score.toLocaleString()}</span>
              </div>
              <ul className="grid gap-1 text-sm">
                {res.breakdown
                  .filter((b) => b.points !== 0)
                  .map((b) => (
                    <li key={b.key} className="flex justify-between border-b border-iron-700/50 pb-0.5">
                      <span className="text-fg-muted">{b.label}</span>
                      <span className={cn('tabular-nums', b.points < 0 ? 'text-danger' : 'text-parchment-100')}>{b.points > 0 ? `+${b.points}` : b.points}</span>
                    </li>
                  ))}
              </ul>
              {res.personalBest && <p className="font-display text-bronze-200">New personal best!</p>}
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>+{res.xpGained.toLocaleString()} XP</span>
                  {res.levelUp && <span className="font-display text-xp">Level up! {res.profile.title}</span>}
                </div>
                <XpBar level={res.profile.level} xpIntoLevel={res.profile.xpIntoLevel} xpForNextLevel={res.profile.xpForNextLevel} />
              </div>
              {res.newlyUnlockedMissionId && <p className="text-parchment-100">Unlocked: Mission {MISSIONS_BY_ID[res.newlyUnlockedMissionId].number} — {MISSIONS_BY_ID[res.newlyUnlockedMissionId].title}</p>}
              {res.newlyUnlockedCharacters.length > 0 && (
                <p className="text-parchment-100">New champions for the Training Grounds: {res.newlyUnlockedCharacters.map((c) => CHARACTERS[c]?.name ?? c).join(', ')}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onMenu}>
            Main menu
          </Button>
          <Button variant="secondary" onClick={onRetry}>
            {victory ? 'Play again' : 'Try again'}
          </Button>
          {victory && onNext && (
            <Button variant="primary" onClick={onNext} autoFocus>
              Next mission
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}
