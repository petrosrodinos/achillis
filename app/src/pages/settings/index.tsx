import { ScreenShell } from '@/components/layout/screen-shell';
import { Panel, SettingsPanel } from '@/ui';
import { useSessionStore } from '@/stores/session-store';
import { Paths } from '@/routes/paths';

/** Settings screen — wraps the shared SettingsPanel (also used by the in-game pause menu). */
export default function SettingsPage() {
  const signedIn = useSessionStore((s) => s.status === 'authenticated');
  return (
    <ScreenShell title="Settings" eyebrow="The Armoury" backTo={Paths.menu} backLabel="Menu" width="md">
      <Panel padding="lg" className="!px-4 sm:!px-7">
        <SettingsPanel />
        <p className="mt-6 border-t border-[#3a2f22] pt-3 text-[0.92rem] italic text-fg-subtle">
          {signedIn ? 'Changes save automatically to your account.' : 'Changes are saved on this device.'}
        </p>
      </Panel>
    </ScreenShell>
  );
}
