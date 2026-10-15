import type { LeaderboardRow, LeaderboardResponse } from '@/api/types';
import { formatDuration, formatNumber } from '@/lib/format';
import { cn } from './cn';
import { IconCrown } from './icons';

export interface LeaderboardTableProps {
  rows: LeaderboardRow[];
  /** The current user's standing (shown as a sticky row when not on this page). */
  me?: LeaderboardResponse['me'];
  /** Show the best-time column (per-mission boards). */
  showTime?: boolean;
  /** Which column the board is ranked by — emphasised. */
  sortedBy?: 'points' | 'time';
  loading?: boolean;
  /** Rows to render as skeletons while loading. */
  skeletonRows?: number;
  emptyMessage?: string;
  caption?: string;
  className?: string;
}

const medal = ['text-[#e9c46a]', 'text-iron-300', 'text-[#c08552]'];

function RankCell({ rank }: { rank: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-heading font-black tabular-nums">
      {rank <= 3 ? <IconCrown size={16} className={medal[rank - 1]} /> : <span className="hidden w-4 sm:inline-block" />}
      {rank}
    </span>
  );
}

/**
 * Ranked table: rank, username, level, points (+ time). Highlights the current user's row and,
 * when they are outside the current page, pins a "Your rank" row to the bottom.
 */
export function LeaderboardTable({
  rows,
  me,
  showTime = false,
  sortedBy = 'points',
  loading,
  skeletonRows = 10,
  emptyMessage = 'No champions yet. Be the first to claim glory.',
  caption = 'Leaderboard',
  className,
}: LeaderboardTableProps) {
  const meOnPage = rows.some((r) => r.isCurrentUser);
  const cols = showTime ? 5 : 4;
  const th = 'px-2 py-2.5 sm:px-3 text-left font-heading text-[0.7rem] font-bold uppercase tracking-[0.16em] text-fg-subtle';
  const td = 'px-2 py-2.5 sm:px-3';
  const emph = 'text-accent-strong';
  return (
    <div className={cn('relative max-h-[60vh] overflow-auto rounded-[4px] border-2 border-[#3a2f22] bg-night-900/70', className)}>
      <table className="w-full border-collapse text-[0.95rem] sm:text-[1.02rem]">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 z-[2] bg-night-800 shadow-[0_2px_0_#3a2f22]">
          <tr>
            <th scope="col" className={cn(th, 'w-14 sm:w-20')}>Rank</th>
            <th scope="col" className={th}>Knight</th>
            <th scope="col" className={cn(th, 'hidden w-20 text-center sm:table-cell')}>Level</th>
            <th scope="col" className={cn(th, 'w-24 text-right sm:w-32', sortedBy === 'points' && emph)} aria-sort={sortedBy === 'points' ? 'descending' : undefined}>
              Points
            </th>
            {showTime && (
              <th scope="col" className={cn(th, 'w-20 text-right sm:w-28', sortedBy === 'time' && emph)} aria-sort={sortedBy === 'time' ? 'ascending' : undefined}>
                Time
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={i} className="border-b border-[#2a221a]">
                  <td colSpan={cols} className="px-3 py-3">
                    <div className="wk-shimmer h-5 rounded bg-night-700/60" />
                  </td>
                </tr>
              ))
            : rows.length === 0
              ? (
                <tr>
                  <td colSpan={cols} className="px-3 py-10 text-center italic text-fg-muted">
                    {emptyMessage}
                  </td>
                </tr>
              )
              : rows.map((r) => (
                  <tr
                    key={`${r.rank}-${r.username}`}
                    aria-current={r.isCurrentUser ? 'true' : undefined}
                    className={cn(
                      'border-b border-[#2a221a] transition-colors hover:bg-night-700/50',
                      r.isCurrentUser && 'bg-[linear-gradient(90deg,rgb(168_119_61/0.35),rgb(168_119_61/0.12))] shadow-[inset_3px_0_0_#dbb784]',
                    )}
                  >
                    <td className={td}><RankCell rank={r.rank} /></td>
                    <td className={cn(td, 'max-w-0 truncate font-semibold sm:max-w-none', r.isCurrentUser ? 'text-parchment-50' : 'text-parchment-100')}>
                      {r.username}
                      {r.isCurrentUser && <span className="ml-2 font-heading text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent-strong">You</span>}
                    </td>
                    <td className={cn(td, 'hidden text-center font-heading tabular-nums text-fg-muted sm:table-cell')}>{r.level}</td>
                    <td className={cn(td, 'text-right font-heading font-bold tabular-nums', sortedBy === 'points' ? 'text-parchment-50' : 'text-fg-muted')}>{formatNumber(r.points)}</td>
                    {showTime && (
                      <td className={cn(td, 'text-right font-heading tabular-nums', sortedBy === 'time' ? 'text-parchment-50' : 'text-fg-muted')}>{formatDuration(r.bestTimeMs)}</td>
                    )}
                  </tr>
                ))}
        </tbody>
        {!loading && me && !meOnPage && (
          <tfoot className="sticky bottom-0 z-[2]">
            <tr className="bg-[linear-gradient(90deg,#4f3417,#2a1d10)] shadow-[0_-2px_0_#a8773d]" aria-label="Your rank">
              <td className={td}><RankCell rank={me.rank} /></td>
              <td className={cn(td, 'max-w-0 truncate font-semibold text-parchment-50 sm:max-w-none')}>
                {me.username}
                <span className="ml-2 font-heading text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent-strong">Your rank</span>
              </td>
              <td className={cn(td, 'hidden text-center font-heading tabular-nums text-parchment-100 sm:table-cell')}>{me.level}</td>
              <td className={cn(td, 'text-right font-heading font-bold tabular-nums text-parchment-50')}>{formatNumber(me.points)}</td>
              {showTime && <td className={cn(td, 'text-right font-heading tabular-nums text-parchment-100')}>{formatDuration(me.bestTimeMs)}</td>}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
