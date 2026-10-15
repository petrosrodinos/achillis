import { useNavigate } from 'react-router-dom';
import { Backdrop, Button } from '@/ui';
import { Paths } from '@/routes/paths';
import { useMenuMusic } from '@/hooks/use-menu-music';
import { useSessionStore } from '@/stores/session-store';

/** Landing/title screen: key art, logo, Login / Register. */
export default function TitlePage() {
  const navigate = useNavigate();
  const offline = useSessionStore((s) => s.offline);
  useMenuMusic();
  return (
    <Backdrop src="/assets/images/ui/title.webp" fallback="dusk" dim={0.2}>
      <main id="main" className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-[12vh] text-center md:items-start md:justify-center md:pb-0 md:pl-[8vw] md:text-left">
        <div className="flex max-w-xl animate-slam-in flex-col items-center gap-6 md:items-start">
          <p className="wk-engraved text-sm text-parchment-200 [text-shadow:0_2px_6px_#000]">A medieval campaign in fifteen battles</p>
          <h1 className="wk-gilded text-[3.4rem] font-black leading-[0.95] min-[400px]:text-6xl md:text-8xl">
            White
            <br />
            Knight
          </h1>
          <p className="max-w-md text-xl italic leading-snug text-parchment-100 [text-shadow:0_2px_6px_#000]">
            Ride out against the Black Knight of Cordova. Lead armies, duel champions, and break the curse upon the realm.
          </p>
          <div className="mt-2 flex w-full max-w-xs flex-col gap-3 md:max-w-sm">
            <Button variant="primary" size="lg" block onClick={() => navigate(Paths.login)} autoFocus>
              Login
            </Button>
            <Button variant="secondary" size="lg" block onClick={() => navigate(Paths.register)}>
              Create account
            </Button>
          </div>
          {offline && (
            <p role="status" className="max-w-sm rounded-[3px] border border-oxblood-500/60 bg-night-900/80 px-3 py-2 text-[0.95rem] text-danger-fg">
              The realm’s messengers cannot be reached right now. You can still try to log in.
            </p>
          )}
        </div>
        <p className="absolute bottom-3 right-4 hidden sm:block font-heading text-[0.7rem] uppercase tracking-[0.2em] text-parchment-300/80">Keyboard &amp; mouse · Touch</p>
      </main>
    </Backdrop>
  );
}
