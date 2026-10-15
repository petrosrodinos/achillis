import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary, LoadingScreen } from '@/ui';
import { ErrorScreen } from '@/pages/error';
import TitlePage from '@/pages/title';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ForgotPasswordPage from '@/pages/forgot-password';
import ResetPasswordPage from '@/pages/reset-password';
import VerifyEmailPage from '@/pages/verify-email';
import MenuPage from '@/pages/menu';
import CampaignPage from '@/pages/campaign';
import BriefingPage from '@/pages/campaign/pages/briefing';
import TrainingPage from '@/pages/training';
import LeaderboardPage from '@/pages/leaderboard';
import ProfilePage from '@/pages/profile';
import SettingsPage from '@/pages/settings';
import UnsupportedPage from '@/pages/unsupported';
import ErrorPage from '@/pages/error';
import NotFoundPage from '@/pages/not-found';
import { GuestOnly, RequireAuth, RequireDeviceSupport } from './guards';
import { Paths } from './paths';

/** The game (three.js etc.) is code-split so menus load fast. */
const PlayPage = lazy(() => import('@/pages/play'));
/** Design-system showcase; the import is dead-code-eliminated from production builds. */
const DevUiPage = import.meta.env.DEV ? lazy(() => import('@/pages/dev-ui')) : null;

/** All routes. Guarded groups: guests (title/login/register), signed-in (menus + game). */
export function AppRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary resetKeys={[location.pathname]} fallback={({ error, reset }) => <ErrorScreen error={error} reset={reset} />}>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path={Paths.title} element={<TitlePage />} />
            <Route path={Paths.login} element={<LoginPage />} />
            <Route path={Paths.register} element={<RegisterPage />} />
          </Route>

          <Route path={Paths.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={Paths.resetPassword} element={<ResetPasswordPage />} />
          <Route path={Paths.verifyEmail} element={<VerifyEmailPage />} />

          <Route element={<RequireAuth />}>
            <Route path={Paths.menu} element={<MenuPage />} />
            <Route path={Paths.campaign} element={<CampaignPage />} />
            <Route path="/campaign/:missionId" element={<BriefingPage />} />
            <Route path={Paths.training} element={<TrainingPage />} />
            <Route path={Paths.leaderboard} element={<LeaderboardPage />} />
            <Route path={Paths.profile} element={<ProfilePage />} />
            <Route path={Paths.settings} element={<SettingsPage />} />
            <Route
              path="/play/:missionId"
              element={
                <RequireDeviceSupport>
                  <PlayPage />
                </RequireDeviceSupport>
              }
            />
          </Route>

          <Route path={Paths.unsupported} element={<UnsupportedPage />} />
          <Route path={Paths.error} element={<ErrorPage />} />
          {DevUiPage && <Route path={Paths.devUi} element={<DevUiPage />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
