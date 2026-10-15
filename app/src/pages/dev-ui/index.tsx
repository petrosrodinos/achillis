import { useState, type ReactNode } from 'react';
import type { LeaderboardRow } from '@/api/types';
import { MISSIONS } from '@/missions/catalog';
import { DEFAULT_KEY_BINDINGS } from '@/core/settings/settings-store';
import {
  BossHealthBar,
  Button,
  Checkbox,
  DialogueBox,
  HudBanner,
  HudCorner,
  HudLabel,
  HudLayer,
  HudName,
  HudStat,
  IconCrown,
  IconGear,
  IconShield,
  IconSkull,
  IconSword,
  IconTrophy,
  KeyBindingDisplay,
  KeyCaptureButton,
  LeaderboardTable,
  LevelBadge,
  LoadingScreen,
  ManaBar,
  MissionCard,
  Modal,
  Panel,
  PanelHeader,
  PasswordInput,
  RankBadge,
  SegmentedHealthBar,
  Select,
  SettingsPanel,
  Slider,
  Spinner,
  StatTile,
  TabPanel,
  Tabs,
  TextInput,
  Toggle,
  Tooltip,
  XpBar,
  toast,
} from '@/ui';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel padding="md" className="mb-6">
      <PanelHeader title={title} level={2} />
      {children}
    </Panel>
  );
}

const ROWS: LeaderboardRow[] = Array.from({ length: 12 }, (_, i) => ({
  rank: i + 1,
  username: ['Gawain', 'Percival', 'Lancelot', 'Bors', 'Tristan', 'Kay', 'Bedivere', 'Galahad', 'Lamorak', 'Gareth', 'Ywain', 'Dagonet'][i],
  level: 30 - i * 2,
  points: 98000 - i * 6150,
  bestTimeMs: 180000 + i * 7300,
  isCurrentUser: i === 4,
}));

/** Dev-only design-system showcase (/dev/ui). */
export default function DevUiPage() {
  const [tab, setTab] = useState<'one' | 'two' | 'three'>('one');
  const [modal, setModal] = useState(false);
  const [hp, setHp] = useState(100);
  const [mounted, setMounted] = useState(150);
  const [boss, setBoss] = useState(400);
  const [mana, setMana] = useState(80);
  const [check, setCheck] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [vol, setVol] = useState(0.6);
  const [diff, setDiff] = useState<'squire' | 'knight' | 'champion'>('knight');
  const [codes, setCodes] = useState<string[]>(['KeyW']);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="wk-gilded mb-2 text-5xl font-black">White Knight UI</h1>
      <p className="mb-8 text-fg-muted">Design-system test bed. Dev builds only.</p>

      <Section title="Typography & colour">
        <p className="font-display text-3xl text-accent-strong">Cinzel Decorative — titles</p>
        <p className="font-heading text-2xl font-bold">Cinzel — headings & HUD numerals 0123456789</p>
        <p className="text-lg">EB Garamond — body text. The quick brown fox jumps over the lazy dog. <em>Italic for captions.</em></p>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {['bg-night-800', 'bg-iron-600', 'bg-bronze-500', 'bg-parchment-200', 'bg-oxblood-600', 'bg-forest-500', 'bg-arcane', 'bg-ember', 'bg-spectral', 'bg-health', 'bg-mana', 'bg-xp', 'bg-surface', 'bg-accent', 'bg-danger', 'bg-success'].map((c) => (
            <div key={c} className="flex flex-col items-center gap-1">
              <span className={`h-10 w-full rounded border border-black/60 ${c}`} />
              <span className="text-[0.7rem] text-fg-subtle">{c.slice(3)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button>Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="icon" aria-label="Settings"><IconGear /></Button>
          <Button variant="primary" size="lg" leadingIcon={<IconSword size={20} />}>Large</Button>
          <Button size="sm">Small</Button>
          <Button variant="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>Loading</Button>
          <Button disabled>Disabled</Button>
          <Spinner label="Loading" />
        </div>
      </Section>

      <Section title="Panels">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel>Iron panel</Panel>
          <Panel metal="bronze">Bronze panel</Panel>
          <Panel surface="parchment" metal="bronze">
            <p>Parchment panel with <strong>ink</strong> text.</p>
            <TextInput label="On parchment" placeholder="Type…" className="mt-2" />
          </Panel>
        </div>
      </Section>

      <Section title="Modal · Tabs · Tooltip · Toasts">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setModal(true)}>Open modal</Button>
          <Tooltip content="A parchment tooltip"><Button>Hover / focus me</Button></Tooltip>
          <Button onClick={() => toast.success('Mission saved', { description: 'Progress stored.' })}>Toast success</Button>
          <Button onClick={() => toast.error('Could not reach server')}>Toast error</Button>
          <Button onClick={() => toast.info('Result queued', { description: 'It will be sent when online.' })}>Toast info</Button>
          <Button onClick={() => { setShowLoading(true); setTimeout(() => setShowLoading(false), 2500); }}>Loading screen</Button>
        </div>
        <div className="mt-6">
          <Tabs idBase="dev" label="Demo tabs" value={tab} onChange={setTab} items={[{ id: 'one', label: 'First' }, { id: 'two', label: 'Second' }, { id: 'three', label: 'Disabled', disabled: true }]} />
          <TabPanel idBase="dev" tabId={tab} className="pt-4">Panel for tab “{tab}”.</TabPanel>
        </div>
        <Modal open={modal} onClose={() => setModal(false)} title="Abandon the quest?" description="Unsaved mission progress will be lost." footer={<><Button variant="ghost" onClick={() => setModal(false)}>Stay</Button><Button variant="danger" onClick={() => setModal(false)}>Abandon</Button></>}>
          <TextInput label="Focus is trapped here" />
        </Modal>
      </Section>

      <Section title="Forms">
        <div className="grid gap-6 md:grid-cols-2">
          <TextInput label="Username" hint="3–20 characters" placeholder="Sir Lancelot" />
          <TextInput label="Email" error="Enter a valid email address" defaultValue="not-an-email" />
          <PasswordInput label="Password" defaultValue="secret123" />
          <Select label="Difficulty" value={diff} onChange={setDiff} options={[{ value: 'squire', label: 'Squire' }, { value: 'knight', label: 'Knight', description: 'Intended' }, { value: 'champion', label: 'Champion' }]} />
          <Checkbox checked={check} onChange={setCheck} label="Remember me" description="On this device" />
          <Toggle checked={toggle} onChange={setToggle} label="Screen shake" description="Shake on heavy hits" />
          <Slider label="Music volume" value={vol} onChange={setVol} />
          <div className="flex flex-col gap-2">
            <KeyBindingDisplay codes={DEFAULT_KEY_BINDINGS.block} />
            <KeyBindingDisplay codes={['Mouse0', 'KeyE']} />
            <KeyCaptureButton actionLabel="Move up" codes={codes} onCapture={(c) => setCodes([c])} onReject={(c) => toast.error(`${c} is reserved`)} />
          </div>
        </div>
      </Section>

      <Section title="Health · Boss · Mana · XP">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedHealthBar current={hp} max={100} segments={4} label="Player" showValue />
            <Button size="sm" onClick={() => setHp((h) => Math.max(0, h - 13))}>Hit −13</Button>
            <Button size="sm" onClick={() => setHp(100)}>Heal</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedHealthBar current={mounted} max={150} segments={6} tone="mount" label="Mounted" showValue />
            <Button size="sm" onClick={() => setMounted((h) => Math.max(0, h - 22))}>Hit −22</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedHealthBar current={50} max={75} segments={3} tone="ally" size="sm" label="Ally unit" />
            <SegmentedHealthBar current={30} max={125} segments={5} tone="enemy" size="sm" label="Enemy unit" />
          </div>
          <BossHealthBar name="The Black Knight" subtitle="Round 2 · On foot" current={boss} max={600} phases={[2 / 3, 1 / 3]} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setBoss((b) => Math.max(0, b - 45))}>Boss −45</Button>
            <Button size="sm" onClick={() => setMana((m) => Math.max(0, m - 12))}>Drain mana</Button>
          </div>
          <ManaBar current={mana} max={100} label="Wizard mana" className="max-w-md" />
          <div className="flex items-center gap-4">
            <LevelBadge level={7} />
            <LevelBadge level={42} size="lg" />
            <XpBar xpIntoLevel={1250} xpForNextLevel={3000} level={7} className="max-w-sm" />
            {(['S', 'A', 'B', 'C', 'D'] as const).map((r) => <RankBadge key={r} rank={r} />)}
          </div>
        </div>
      </Section>

      <Section title="HUD primitives">
        <div className="relative h-56 overflow-hidden rounded bg-[linear-gradient(180deg,#9fb3c8,#d8c79a_60%,#6b5b45)]">
          <HudLayer>
            <HudCorner position="top-left">
              <HudName>White Knight</HudName>
              <SegmentedHealthBar current={hp} max={100} segments={4} size="sm" />
              <div className="flex gap-4"><HudStat icon={<IconShield size={18} />} value="×3" /><HudStat icon={<IconSkull size={18} />} value={12} label="Enemies" /></div>
            </HudCorner>
            <HudCorner position="top-center"><HudStat label="Kills" value={37} large /></HudCorner>
            <HudCorner position="top-right"><HudLabel>Mission III · Stage 2/3</HudLabel><div className="flex items-center gap-2"><HudLabel>Level</HudLabel><LevelBadge level={7} size="sm" /></div></HudCorner>
            <HudCorner position="center"><HudBanner sub="Steel against steel">Round 2</HudBanner></HudCorner>
          </HudLayer>
        </div>
      </Section>

      <Section title="Mission cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MissionCard mission={MISSIONS[0]} status="completed" bestScore={8450} bestTimeMs={312000} bestRank="A" />
          <MissionCard mission={MISSIONS[1]} status="completed" bestScore={12000} bestTimeMs={95000} bestRank="S" />
          <MissionCard mission={MISSIONS[2]} status="unlocked" isCurrent />
          <MissionCard mission={MISSIONS[3]} status="locked" />
        </div>
      </Section>

      <Section title="Stat tiles">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile icon={<IconCrown size={22} />} label="Total points" value="48,200" />
          <StatTile icon={<IconTrophy size={22} />} label="Global rank" value="#128" sub="Top 5%" />
          <StatTile label="Best time" value="3:07.4" />
        </div>
      </Section>

      <Section title="Leaderboard">
        <LeaderboardTable rows={ROWS.slice(0, 4).map((r) => ({ ...r, isCurrentUser: false }))} me={{ rank: 211, username: 'You', level: 9, points: 14250, bestTimeMs: 301000 }} showTime />
        <div className="h-4" />
        <LeaderboardTable rows={ROWS} loading={false} />
      </Section>

      <Section title="Dialogue">
        <DialogueBox lines={MISSIONS[0].briefing} captureKeys={false} />
      </Section>

      <Section title="Settings panel">
        <SettingsPanel />
      </Section>

      {showLoading && <LoadingScreen progress={0.42} label="Forging armour…" />}
    </div>
  );
}
