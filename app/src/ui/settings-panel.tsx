import { useState } from 'react';
import type { GameAction } from '@/api/types';
import { useSettingsStore, formatKeyCode } from '@/core/settings/settings-store';
import { audio } from '@/core/audio/audio-manager';
import { DifficultyFormOptions } from '@/config/constants/dropdowns/settings/difficulty-form.options';
import { GameActionOptions, getGameActionLabel } from '@/config/constants/dropdowns/settings/game-action.options';
import { cn } from './cn';
import { Tabs, TabPanel, type TabItem } from './tabs';
import { useDeviceSupport } from '@/hooks/use-device-support';
import { useTouchSettingsStore } from '@/stores/touch-settings-store';
import { Slider } from './slider';
import { Toggle } from './toggles';
import { Select } from './select';
import { KeyCaptureButton } from './key-binding';
import { Button } from './button';
import { Modal } from './modal';
import { toast } from './toast';
import { IconClose, IconRefresh } from './icons';

type SettingsTab = 'audio' | 'gameplay' | 'controls' | 'touch';

const BASE_TABS: TabItem<SettingsTab>[] = [
  { id: 'audio', label: 'Audio' },
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'controls', label: 'Keys' },
];
const TOUCH_TAB: TabItem<SettingsTab> = { id: 'touch', label: 'Touch' };

const TOUCH_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const;

export interface SettingsPanelProps {
  /** Initial tab. */
  initialTab?: SettingsTab;
  /** Tighter layout for the in-game pause overlay. */
  compact?: boolean;
  className?: string;
}

/**
 * The complete settings UI (volume, accessibility, difficulty, key remapping) bound to the
 * settings store. Changes apply instantly and are synced to the server by `startSettingsSync`.
 * Render it on the Settings page or inside the in-game pause menu.
 */
export function SettingsPanel({ initialTab, compact, className }: SettingsPanelProps) {
  const { isTouch } = useDeviceSupport();
  const items = isTouch ? [...BASE_TABS, TOUCH_TAB] : BASE_TABS;
  const [picked, setTab] = useState<SettingsTab>(initialTab ?? 'audio');
  // Fall back if the Touch tab disappears (e.g. a mouse is connected).
  const tab: SettingsTab = picked === 'touch' && !isTouch ? 'audio' : picked;
  return (
    <div className={cn('flex min-w-0 flex-col gap-5', className)}>
      <Tabs idBase="settings" label="Settings sections" items={items} value={tab} onChange={setTab} />
      <TabPanel idBase="settings" tabId={tab} className={cn(compact ? 'max-h-[60vh] overflow-y-auto pr-2' : '')}>
        {tab === 'audio' && <AudioSection />}
        {tab === 'gameplay' && <GameplaySection />}
        {tab === 'controls' && <ControlsSection />}
        {tab === 'touch' && <TouchSection />}
      </TabPanel>
    </div>
  );
}

function AudioSection() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Slider label="Master volume" value={settings.masterVolume} onChange={(v) => update({ masterVolume: v })} onCommit={() => audio.play('ui-confirm', { volume: 0.8 })} />
      <Slider label="Music" value={settings.musicVolume} onChange={(v) => update({ musicVolume: v })} onCommit={() => void audio.playMusic('menu')} />
      <Slider label="Sound effects" value={settings.sfxVolume} onChange={(v) => update({ sfxVolume: v })} onCommit={() => audio.play('hit-armor', { volume: 0.8 })} />
      <p className="text-[0.95rem] italic text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">Release a slider to hear a preview.</p>
    </div>
  );
}

function GameplaySection() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Select
        label="Difficulty"
        value={settings.difficulty}
        options={DifficultyFormOptions}
        onChange={(difficulty) => update({ difficulty })}
        hint={DifficultyFormOptions.find((o) => o.value === settings.difficulty)?.description}
      />
      <Toggle
        label="Reduced motion"
        description="Removes screen transitions, text animation and camera flourishes."
        checked={settings.reducedMotion}
        onChange={(reducedMotion) => update({ reducedMotion })}
      />
      <Toggle label="Screen shake" description="Camera shake on heavy impacts." checked={settings.screenShake} onChange={(screenShake) => update({ screenShake })} />
      <Toggle label="Show FPS" description="Frame-rate counter in the corner of the screen." checked={settings.showFps} onChange={(showFps) => update({ showFps })} />
    </div>
  );
}

function TouchSection() {
  const touch = useTouchSettingsStore((s) => s.touch);
  const updateTouch = useTouchSettingsStore((s) => s.updateTouch);
  const resetTouch = useTouchSettingsStore((s) => s.resetTouch);
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Toggle label="On-screen controls" description="Virtual stick and action buttons during play." checked={touch.enabled} onChange={(enabled) => updateTouch({ enabled })} />
      <Slider label="Control opacity" value={touch.opacity} min={0.2} max={1} step={0.05} onChange={(opacity) => updateTouch({ opacity })} disabled={!touch.enabled} />
      <Select label="Button size" value={touch.size} options={TOUCH_SIZE_OPTIONS} onChange={(size) => updateTouch({ size })} disabled={!touch.enabled} />
      <Toggle label="Left-handed layout" description="Stick on the right, attack buttons on the left." checked={touch.leftHanded} onChange={(leftHanded) => updateTouch({ leftHanded })} disabled={!touch.enabled} />
      <Toggle label="Vibration" description="Short pulses on hits and blocks (where supported)." checked={touch.haptics} onChange={(haptics) => updateTouch({ haptics })} />
      <div>
        <Button variant="secondary" size="sm" leadingIcon={<IconRefresh size={16} />} onClick={() => resetTouch()}>
          Reset touch controls
        </Button>
      </div>
      <p className="text-[0.95rem] italic text-fg-subtle in-[.wk-frame--parchment]:text-ink-muted">Touch preferences are saved on this device.</p>
    </div>
  );
}

function ControlsSection() {
  const bindings = useSettingsStore((s) => s.settings.keyBindings);
  const bind = useSettingsStore((s) => s.bind);
  const resetBindings = useSettingsStore((s) => s.resetBindings);
  const [confirmReset, setConfirmReset] = useState(false);

  const setSlot = (action: GameAction, slot: 0 | 1, code: string) => {
    const owner = (Object.keys(bindings) as GameAction[]).find((a) => a !== action && bindings[a].includes(code));
    const current = [...bindings[action]];
    if (slot === 0) current[0] = code;
    else current[current.length >= 1 ? 1 : 0] = code;
    const next = Array.from(new Set(current.filter(Boolean)));
    bind(action, next);
    if (owner) toast.info(`${formatKeyCode(code)} moved`, { description: `It was unbound from “${getGameActionLabel(owner)}”.` });
  };
  const clearSecondary = (action: GameAction) => bind(action, bindings[action].slice(0, 1));

  const groups = Array.from(new Set(GameActionOptions.map((o) => o.group)));
  const unbound = GameActionOptions.filter((o) => bindings[o.id].length === 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.98rem] text-fg-muted in-[.wk-frame--parchment]:text-ink-muted">
          Select a binding, then press a key or mouse button. <kbd className="font-heading text-[0.85rem] font-bold">Esc</kbd> cancels and always pauses.
        </p>
        <Button variant="secondary" size="sm" leadingIcon={<IconRefresh size={16} />} onClick={() => setConfirmReset(true)}>
          Reset to defaults
        </Button>
      </div>
      {unbound.length > 0 && (
        <p role="status" className="rounded-[3px] border border-oxblood-500/60 bg-oxblood-900/40 px-3 py-2 text-[0.95rem] text-danger-fg">
          Unbound: {unbound.map((u) => u.label).join(', ')}
        </p>
      )}
      {groups.map((group) => (
        <section key={group} aria-label={group}>
          <h3 className="wk-engraved mb-2 text-left text-[0.8rem] text-accent in-[.wk-frame--parchment]:text-oxblood-700">{group}</h3>
          <ul className="flex flex-col">
            {GameActionOptions.filter((o) => o.group === group).map((o) => {
              const codes = bindings[o.id];
              return (
                <li
                  key={o.id}
                  className="grid grid-cols-2 items-center gap-x-2 gap-y-1.5 border-b border-[#2a221a] py-2 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                >
                  <span className="col-span-2 text-[1.02rem] sm:col-span-1 sm:pr-4">{o.label}</span>
                  <KeyCaptureButton
                    actionLabel={`${o.label} (primary)`}
                    codes={codes.slice(0, 1)}
                    onCapture={(code) => setSlot(o.id, 0, code)}
                    onReject={(code) => toast.error(`${formatKeyCode(code)} is reserved`, { description: 'Escape, F5, F11 and F12 cannot be bound.' })}
                  />
                  <div className="flex min-w-0 items-center gap-1">
                    <KeyCaptureButton
                      className="flex-1"
                      actionLabel={`${o.label} (secondary)`}
                      codes={codes.slice(1, 2)}
                      onCapture={(code) => setSlot(o.id, 1, code)}
                      onReject={(code) => toast.error(`${formatKeyCode(code)} is reserved`, { description: 'Escape, F5, F11 and F12 cannot be bound.' })}
                    />
                    {codes.length > 1 && (
                      <Button variant="ghost" size="sm" aria-label={`Clear secondary binding for ${o.label}`} className="!px-2" onClick={() => clearSecondary(o.id)}>
                        <IconClose size={14} />
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset key bindings?"
        description="Every action returns to its default key. This cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                resetBindings();
                setConfirmReset(false);
                toast.success('Key bindings restored');
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </div>
  );
}
