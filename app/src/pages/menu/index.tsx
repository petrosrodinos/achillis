import { useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArtImage,
  Backdrop,
  Button,
  IconCrown,
  IconDoor,
  IconFlag,
  IconGear,
  IconLock,
  IconPlay,
  IconShield,
  IconSword,
  IconTrophy,
  IconUser,
  LevelBadge,
  Modal,
  Panel,
  Tooltip,
  XpBar,
  uiSound,
} from '@/ui';
import { Paths } from '@/routes/paths';
import { useMenuMusic } from '@/hooks/use-menu-music';
import { useOutboxPending } from '@/hooks/use-outbox-pending';
import { useSessionStore } from '@/stores/session-store';
import { useProgress } from '@/features/progress/hooks/use-progress';
import { getContinueMissionId, isCampaignComplete } from '@/features/progress/utils/progress.utils';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { MISSIONS_BY_ID } from '@/missions/catalog';
import { formatNumber, toRoman } from '@/lib/format';

/** Main menu: Continue, Campaign, Training Grounds, Leaderboard, Profile, Settings, Logout. */
export default function MenuPage() {
  useMenuMusic();
  const navigate = useNavigate();
  const me = useSessionStore((s) => s.me);
  const progressQuery = useProgress();
  const progress = progressQuery.data;
  const logout = useLogout();
  const pending = useOutboxPending();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const continueId = getContinueMissionId(progress);
  const continueMission = MISSIONS_BY_ID[continueId];
  const trainingUnlocked = !!progress?.trainingGroundsUnlocked;
  const campaignDone = isCampaignComplete(progress);
  const progressLoading = !progress && progressQuery.isPending;

  // ↑/↓ move between menu entries like a console menu.
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]:not([disabled])') ?? []);
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const next = items[(idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
    if (next) {
      e.preventDefault();
      next.focus();
      uiSound('ui-hover');
    }
  };

  const go = (to: string) => () => navigate(to);

  return (
    <Backdrop src="/assets/images/ui/menu.webp" fallback="dusk" dim={0.3}>
      <main id="main" className="mx-auto grid min-h-dvh max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:px-12">
        <div className="flex flex-col gap-8 animate-rise-in">
          <h1 className="wk-gilded text-[2.6rem] font-black leading-none min-[400px]:text-5xl md:text-6xl">White Knight</h1>
          <nav aria-label="Main menu">
            <div ref={listRef} onKeyDown={onMenuKey} className="flex flex-col gap-3">
              <Button
                data-menu-item
                variant="primary"
                size="lg"
                block
                autoFocus
                disabled={progressLoading}
                leadingIcon={<IconPlay size={20} />}
                onClick={go(continueId === 'm07' ? Paths.training : Paths.briefing(continueId))}
                clickSound="ui-confirm"
                className="!justify-start"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span>{campaignDone ? 'Replay' : 'Continue'}</span>
                  <span className="font-body text-[0.9rem] normal-case tracking-normal opacity-85">
                    {progressLoading ? 'Consulting the chronicles…' : `Mission ${toRoman(continueMission.number)} · ${continueMission.title}`}
                  </span>
                </span>
              </Button>
              <Button data-menu-item size="lg" block leadingIcon={<IconFlag size={20} />} onClick={go(Paths.campaign)} className="!justify-start">
                Campaign
              </Button>
              {trainingUnlocked ? (
                <Button data-menu-item size="lg" block leadingIcon={<IconSword size={20} />} onClick={go(Paths.training)} className="!justify-start">
                  Training Grounds
                </Button>
              ) : (
                <Tooltip content="Unlocks when you reach Mission VII — complete Mission VI, Voyage Home." side="top">
                  <span data-menu-item tabIndex={0} className="block rounded-[4px] outline-offset-4" aria-label="Training Grounds (locked). Complete Mission 6 to unlock.">
                    <Button size="lg" block disabled leadingIcon={<IconLock size={20} />} className="pointer-events-none !justify-start" tabIndex={-1} aria-hidden="true">
                      Training Grounds
                    </Button>
                  </span>
                </Tooltip>
              )}
              <Button data-menu-item size="lg" block leadingIcon={<IconTrophy size={20} />} onClick={go(Paths.leaderboard)} className="!justify-start">
                Leaderboard
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button data-menu-item block leadingIcon={<IconUser size={18} />} onClick={go(Paths.profile)}>
                  Profile
                </Button>
                <Button data-menu-item block leadingIcon={<IconGear size={18} />} onClick={go(Paths.settings)}>
                  Settings
                </Button>
              </div>
              <Button data-menu-item variant="ghost" block leadingIcon={<IconDoor size={18} />} onClick={() => setConfirmLogout(true)}>
                Logout
              </Button>
            </div>
          </nav>
          {pending > 0 && (
            <p role="status" className="text-[0.95rem] italic text-fg-muted">
              {pending === 1 ? 'One mission result is' : `${pending} mission results are`} waiting to be sent — it will be submitted when the connection returns.
            </p>
          )}
        </div>

        {me && (
          <aside className="hidden flex-col gap-5 justify-self-end lg:flex lg:w-[min(32rem,100%)]" aria-label="Your knight">
            <Panel metal="bronze" padding="md" className="animate-rise-in [animation-delay:80ms]">
              <div className="flex items-center gap-4">
                <LevelBadge level={me.profile.level} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-2xl font-bold text-parchment-50">{me.username}</p>
                  <p className="italic text-fg-muted">{me.profile.title}</p>
                  <XpBar className="mt-2" xpIntoLevel={me.profile.xpIntoLevel} xpForNextLevel={me.profile.xpForNextLevel} level={me.profile.level} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-5 border-t border-[#3a2f22] pt-3 text-fg-muted">
                <span className="inline-flex items-center gap-1.5"><IconCrown size={18} className="text-accent" /> <span className="font-heading font-bold tabular-nums text-parchment-50">{formatNumber(me.profile.totalPoints)}</span> points</span>
                <span className="inline-flex items-center gap-1.5"><IconShield size={18} className="text-accent" /> <span className="font-heading font-bold tabular-nums text-parchment-50">{me.unlockedCharacters.length}</span> fighters</span>
              </div>
            </Panel>
            <Panel padding="none" className="overflow-hidden animate-rise-in [animation-delay:140ms]">
              <ArtImage src={continueMission.illustration} alt="" fallback="dusk" className="aspect-[16/8] w-full" />
              <div className="p-4">
                <p className="wk-engraved text-[0.75rem] text-accent">{campaignDone ? 'Campaign complete' : 'Next in your chronicle'}</p>
                <p className="mt-0.5 font-heading text-xl font-bold text-parchment-50">
                  {toRoman(continueMission.number)} · {continueMission.title}
                </p>
                <p className="mt-1 text-fg-muted">{continueMission.synopsis}</p>
              </div>
            </Panel>
          </aside>
        )}
      </main>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Leave the realm?"
        description="Your progress is saved to your account."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmLogout(false)}>Stay</Button>
            <Button
              variant="danger"
              loading={logout.isPending}
              onClick={() => logout.mutate(undefined, { onSettled: () => navigate(Paths.title, { replace: true }) })}
            >
              Logout
            </Button>
          </>
        }
      />
    </Backdrop>
  );
}
