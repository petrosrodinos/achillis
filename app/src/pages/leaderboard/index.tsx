import { useState } from 'react';
import { ScreenShell } from '@/components/layout/screen-shell';
import { Button, IconChevronLeft, IconChevronRight, IconRefresh, LeaderboardTable, Panel, Select, TabPanel, Tabs } from '@/ui';
import type { LeaderboardQuery, LeaderboardScope, LeaderboardSort, LeaderboardWindow } from '@/api/types';
import type { MissionId } from '@/content/ids';
import { MISSIONS } from '@/missions/catalog';
import { useLeaderboard } from '@/features/leaderboard/hooks/use-leaderboard';
import { LeaderboardScopeOptions, LeaderboardSortOptions, LeaderboardWindowOptions } from '@/config/constants/dropdowns/leaderboard/leaderboard-filter.options';
import { errorMessage } from '@/api/errors';
import { Paths } from '@/routes/paths';
import { toRoman } from '@/lib/format';

const PAGE_SIZE = 20;
const MISSION_OPTIONS = MISSIONS.filter((m) => !m.isTraining).map((m) => ({ value: m.id, label: `${toRoman(m.number)} · ${m.title}` }));

/** Global and per-mission leaderboards with time windows, sort (mission scope) and pagination. */
export default function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [win, setWin] = useState<LeaderboardWindow>('all');
  const [missionId, setMissionId] = useState<MissionId>('m01');
  const [sort, setSort] = useState<LeaderboardSort>('points');
  const [page, setPage] = useState(1);

  const query: LeaderboardQuery = {
    scope,
    missionId: scope === 'mission' ? missionId : undefined,
    window: win,
    sort: scope === 'mission' ? sort : 'points',
    page,
    limit: PAGE_SIZE,
  };
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = useLeaderboard(query);
  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
  };

  const pg = data?.pagination;

  return (
    <ScreenShell title="Leaderboard" eyebrow="Hall of Champions" backTo={Paths.menu} backLabel="Menu" width="lg">
      <Panel padding="md" className="!px-3 sm:!px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Tabs idBase="lb-scope" label="Leaderboard scope" items={LeaderboardScopeOptions} value={scope} onChange={resetPage(setScope)} />
          <Tabs idBase="lb-window" label="Time window" size="sm" items={LeaderboardWindowOptions} value={win} onChange={resetPage(setWin)} />
        </div>

        <TabPanel idBase="lb-scope" tabId={scope} className="mt-5">
          {scope === 'mission' && (
            <div className="mb-4 grid grid-cols-1 gap-4 sm:flex sm:flex-wrap">
              <Select label="Mission" value={missionId} options={MISSION_OPTIONS} onChange={resetPage(setMissionId)} minWidth="18rem" />
              <Select label="Rank by" value={sort} options={LeaderboardSortOptions} onChange={resetPage(setSort)} minWidth="12rem" />
            </div>
          )}

          {isError && !data ? (
            <div role="alert" className="flex flex-col items-center gap-3 rounded-[4px] border-2 border-oxblood-600/60 bg-night-900/70 px-4 py-10 text-center">
              <p className="text-danger-fg">{errorMessage(error, 'The leaderboard could not be loaded.')}</p>
              <Button size="sm" leadingIcon={<IconRefresh size={16} />} loading={isFetching} onClick={() => void refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <LeaderboardTable
              caption={scope === 'global' ? 'Global leaderboard' : `Leaderboard for mission ${missionId}`}
              rows={data?.data ?? []}
              me={data?.me}
              loading={isPending}
              showTime={scope === 'mission'}
              sortedBy={scope === 'mission' ? sort : 'points'}
              className={isPlaceholderData ? 'opacity-70 transition-opacity' : 'transition-opacity'}
            />
          )}

          {pg && pg.totalPages > 1 && (
            <nav aria-label="Leaderboard pages" className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button size="sm" leadingIcon={<IconChevronLeft size={16} />} disabled={!pg.hasPrev || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <p className="order-first w-full text-center font-heading text-sm font-bold tracking-wider text-fg-muted sm:order-none sm:w-auto" aria-live="polite">
                Page {pg.page} of {pg.totalPages} · {pg.total.toLocaleString('en-GB')} knights
              </p>
              <Button size="sm" trailingIcon={<IconChevronRight size={16} />} disabled={!pg.hasNext || isFetching} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </nav>
          )}
        </TabPanel>
      </Panel>
    </ScreenShell>
  );
}
