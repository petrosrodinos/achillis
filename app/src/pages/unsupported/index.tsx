import { useNavigate } from 'react-router-dom';
import { MessageScreen } from '@/components/layout/message-screen';
import { Button, IconShield } from '@/ui';
import { MIN_GAME_VIEWPORT, useDeviceSupport, type DeviceSupport } from '@/hooks/use-device-support';
import { Paths } from '@/routes/paths';

const REASON_TEXT = {
  viewport: (s: DeviceSupport) =>
    `Your screen is ${s.viewport.width}×${s.viewport.height}. The battlefield needs at least ${MIN_GAME_VIEWPORT.width}×${MIN_GAME_VIEWPORT.height} in landscape — enlarge the window or use a larger device.`,
  webgl2: () => 'Your browser has WebGL 2 disabled or unavailable. Update your browser or enable hardware acceleration.',
} as const;

/** Explains why the game cannot run here. Rendered by the play-route guard and at /unsupported. */
export function UnsupportedScreen({ support }: { support: DeviceSupport }) {
  const navigate = useNavigate();
  return (
    <MessageScreen emblem={<IconShield size={56} className="text-iron-300" />} title="This device cannot take the field">
      <ul className="flex flex-col gap-2 text-left">
        {support.reasons.length === 0 ? (
          <li>Your device meets the requirements — you are ready to ride.</li>
        ) : (
          support.reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent" />
              {REASON_TEXT[r](support)}
            </li>
          ))
        )}
      </ul>
      <p className="mt-4 text-[0.98rem] text-fg-subtle">Menus, your profile and the leaderboards still work here.</p>
      <div className="mt-6 flex justify-center">
        <Button variant="primary" onClick={() => navigate(Paths.menu)}>
          Back to the menu
        </Button>
      </div>
    </MessageScreen>
  );
}

/** `/unsupported` route. */
export default function UnsupportedPage() {
  const support = useDeviceSupport();
  return <UnsupportedScreen support={support} />;
}
