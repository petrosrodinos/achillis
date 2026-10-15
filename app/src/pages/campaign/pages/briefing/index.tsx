import { useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ScreenShell } from '@/components/layout/screen-shell';
import { ArtImage, Button, DialogueBox, LoadingScreen, IconClock, IconLock, IconPlay, IconStar, Panel, RankBadge, StatTile } from '@/ui';
import { MISSIONS_BY_ID } from '@/missions/catalog';
import { MISSION_IDS, type MissionId } from '@/content/ids';
import { useProgress } from '@/features/progress/hooks/use-progress';
import { missionEntry, missionStatus } from '@/features/progress/utils/progress.utils';
import { Paths } from '@/routes/paths';
import { formatDuration, formatNumber, toRoman } from '@/lib/format';
import { ControlsReminder } from '../../components/controls-reminder';
import NotFoundPage from '@/pages/not-found';

/** Mission briefing: illustration, story (DialogueBox), objective, controls, best result, Begin. */
export default function BriefingPage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const beginRef = useRef<HTMLButtonElement>(null);
  const { data: progress, isPending } = useProgress();

  if (!missionId || !(MISSION_IDS as readonly string[]).includes(missionId)) return <NotFoundPage />;
  const id = missionId as MissionId;
  const mission = MISSIONS_BY_ID[id];
  if (mission.isTraining) return <Navigate to={Paths.training} replace />;

  const status = missionStatus(progress, id);
  const entry = missionEntry(progress, id);
  const loading = !progress && isPending;
  const locked = !loading && status === 'locked';

  return (
    <ScreenShell title={mission.title} eyebrow={`Mission ${toRoman(mission.number)} · ${mission.engineLabel}`} backTo={Paths.campaign} backLabel="Campaign" width="xl">
      {loading ? (
        <LoadingScreen fullscreen={false} label="Unrolling the map…" tips={[]} />
      ) : locked ? (
        <Panel metal="iron" padding="lg" className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <IconLock size={44} className="text-iron-300" />
          <p className="text-xl">This mission is still sealed.</p>
          <p className="text-fg-muted">Complete Mission {toRoman(mission.number - 1)} to unlock it. The campaign must be played in order.</p>
          <Button variant="primary" onClick={() => navigate(Paths.campaign)}>Back to campaign</Button>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)]">
          <div className="flex flex-col gap-6">
            <Panel metal="bronze" padding="none" className="overflow-hidden">
              <ArtImage src={mission.illustration} alt={`Illustration: ${mission.synopsis}`} fallback={mission.engine === 'open-field' ? 'forest' : 'dusk'} className="aspect-[3/2] w-full" />
            </Panel>
            <DialogueBox key={id} lines={mission.briefing} onDone={() => beginRef.current?.focus()} doneLabel="To arms" />
          </div>

          <div className="flex flex-col gap-5">
            <Panel padding="md">
              <h2 className="wk-engraved mb-2 text-[0.8rem] text-accent">Objective</h2>
              <p className="text-lg leading-snug text-parchment-50">{mission.objective}</p>
              <h2 className="wk-engraved mb-1.5 mt-4 text-[0.8rem] text-accent">Lands</h2>
              <ul className="flex flex-wrap gap-2">
                {mission.environments.map((env, i) => (
                  <li key={env} className="rounded-[3px] border border-[#3a2f22] bg-night-900/70 px-2.5 py-0.5 text-[0.95rem] text-fg-muted">
                    <span className="mr-1 font-heading text-[0.75rem] text-accent">{i + 1}.</span>
                    {env}
                  </li>
                ))}
              </ul>
              {entry && entry.completions > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <StatTile icon={<IconStar size={20} />} label="Best score" value={formatNumber(entry.bestScore)} sub={entry.bestRank ? <span className="inline-flex items-center gap-1">Rank <RankBadge rank={entry.bestRank} size="sm" /></span> : undefined} />
                  <StatTile icon={<IconClock size={20} />} label="Best time" value={formatDuration(entry.bestTimeMs)} sub={`${entry.completions}× cleared`} />
                </div>
              )}
              <Button
                ref={beginRef}
                variant="primary"
                size="lg"
                block
                className="mt-6"
                leadingIcon={<IconPlay size={20} />}
                clickSound="ui-confirm"
                onClick={() => navigate(Paths.play(id))}
              >
                {status === 'completed' ? 'Play again' : 'Begin'}
              </Button>
            </Panel>
            <Panel padding="md" aria-labelledby="controls-title">
              <h2 id="controls-title" className="wk-engraved mb-3 text-[0.8rem] text-accent">Controls</h2>
              <ControlsReminder mission={mission} />
            </Panel>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
