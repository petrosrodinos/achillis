import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenShell } from '@/components/layout/screen-shell';
import { ArtImage, Button, IconBoot, IconHorse, IconLock, IconPlay, LoadingScreen, Panel, cn, uiSound } from '@/ui';
import { CHARACTER_IDS, type CharacterId } from '@/content/ids';
import { CHARACTERS } from '@/content/characters';
import { MISSIONS_BY_ID } from '@/missions/catalog';
import { useProgress } from '@/features/progress/hooks/use-progress';
import { useSessionStore } from '@/stores/session-store';
import { Paths } from '@/routes/paths';
import { PortraitRadioGroup } from './components/portrait-radio-group';

/** Training Grounds (Mission 7): pick your fighter, an opponent, and mounted / on foot. */
export default function TrainingPage() {
  const navigate = useNavigate();
  const me = useSessionStore((s) => s.me);
  const { data: progress, isPending } = useProgress();
  const mission = MISSIONS_BY_ID.m07;

  const unlocked = useMemo(() => {
    const set = new Set<CharacterId>(['white-knight', ...(me?.unlockedCharacters ?? []), ...(progress?.unlockedCharacters ?? [])]);
    return CHARACTER_IDS.filter((id) => set.has(id));
  }, [me, progress]);

  const opponents = useMemo(() => CHARACTER_IDS.filter((id) => id !== 'emperor-knight' || unlocked.includes('emperor-knight')), [unlocked]);

  const [player, setPlayer] = useState<CharacterId>('white-knight');
  const [opponent, setOpponent] = useState<CharacterId>('black-knight');
  const [mounted, setMounted] = useState(false);

  const fighter = unlocked.includes(player) ? player : unlocked[0];
  const rival = opponents.includes(opponent) ? opponent : opponents[0];

  if (!progress && isPending) {
    return (
      <ScreenShell title="Training Grounds" backTo={Paths.menu} backLabel="Menu">
        <LoadingScreen fullscreen={false} tips={[]} label="Raking the tournament sand…" />
      </ScreenShell>
    );
  }

  if (!progress?.trainingGroundsUnlocked) {
    return (
      <ScreenShell title="Training Grounds" eyebrow="Mission VII" backTo={Paths.menu} backLabel="Menu">
        <Panel padding="lg" className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <IconLock size={44} className="text-iron-300" />
          <p className="text-xl">The tournament grounds are closed to you — for now.</p>
          <p className="text-fg-muted">Complete Mission VI, Voyage Home, and the Paladins of the realm will open their lists to you.</p>
          <Button variant="primary" onClick={() => navigate(Paths.campaign)}>To the campaign</Button>
        </Panel>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Training Grounds"
      eyebrow="Mission VII · Tournament"
      backTo={Paths.menu}
      backLabel="Menu"
      width="xl"
      backdrop={mission.illustration}
      fallback="ember"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr_20rem]">
        <Panel padding="md" aria-labelledby="pick-fighter">
          <h2 id="pick-fighter" className="wk-engraved mb-1 text-lg text-accent-strong">Your champion</h2>
          <p className="mb-4 text-fg-muted">{unlocked.length} of {CHARACTER_IDS.length} fighters unlocked. Win campaign missions to recruit more.</p>
          <PortraitRadioGroup label="Your champion" options={unlocked} value={fighter} onChange={setPlayer} />
        </Panel>

        <Panel padding="md" aria-labelledby="pick-rival">
          <h2 id="pick-rival" className="wk-engraved mb-1 text-lg text-accent-strong">Your rival</h2>
          <p className="mb-4 text-fg-muted">Face anyone from the roster.</p>
          <PortraitRadioGroup label="Your rival" options={opponents} value={rival} onChange={setOpponent} />
        </Panel>

        <Panel metal="bronze" padding="md" className="flex flex-col gap-5 self-start xl:sticky xl:top-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
            <div>
              <ArtImage src={CHARACTERS[fighter].portrait} alt="" fallback="portrait" className="mx-auto aspect-square w-full rounded-[3px]" />
              <p className="mt-1 font-heading text-[0.9rem] font-bold">{CHARACTERS[fighter].name}</p>
            </div>
            <span className="wk-gilded text-2xl font-black">vs</span>
            <div>
              <ArtImage src={CHARACTERS[rival].portrait} alt="" fallback="portrait" className="mx-auto aspect-square w-full rounded-[3px] [transform:scaleX(-1)]" />
              <p className="mt-1 font-heading text-[0.9rem] font-bold">{CHARACTERS[rival].name}</p>
            </div>
          </div>

          <fieldset>
            <legend className="wk-engraved mb-2 text-[0.8rem] text-accent">Bout</legend>
            <div role="radiogroup" aria-label="Bout type" className="grid grid-cols-2 gap-2">
              {[
                { v: false, label: 'On foot', icon: <IconBoot size={18} /> },
                { v: true, label: 'Mounted', icon: <IconHorse size={18} /> },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  role="radio"
                  aria-checked={mounted === o.v}
                  tabIndex={mounted === o.v ? 0 : -1}
                  onClick={() => {
                    uiSound('ui-toggle');
                    setMounted(o.v);
                  }}
                  onKeyDown={(e) => {
                    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                      e.preventDefault();
                      setMounted((m) => !m);
                      uiSound('ui-toggle');
                      (e.currentTarget.parentElement?.querySelector(`[aria-checked="false"]`) as HTMLElement | null)?.focus();
                    }
                  }}
                  className={cn('wk-plate inline-flex min-h-11 items-center justify-center gap-2 font-heading text-[0.85rem] font-bold uppercase tracking-[0.1em]', mounted === o.v && 'wk-plate--bronze')}
                >
                  {o.icon}
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <p className="text-[0.95rem] text-fg-muted">{mission.objective} One round{mounted ? ' — horses fall when health runs low' : ''}.</p>

          <Button
            variant="primary"
            size="lg"
            block
            leadingIcon={<IconPlay size={20} />}
            clickSound="ui-confirm"
            onClick={() => navigate(Paths.playTraining(fighter, rival, mounted))}
          >
            Enter the lists
          </Button>
        </Panel>
      </div>
    </ScreenShell>
  );
}
