import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginDto, type RegisterDto } from '../services/auth.services';
import { useSessionStore } from '@/stores/session-store';
import { queryKeys } from '@/api/query-keys';
import { outbox } from '@/api/outbox';

/** Sign in with email-or-username; populates the session on success. */
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: ({ user }) => {
      useSessionStore.getState().setMe(user);
      void qc.invalidateQueries({ queryKey: queryKeys.progress });
      void outbox.flush();
    },
  });
}

/** Create an account; the API signs the user in immediately (verification is non-blocking). */
export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
    onSuccess: ({ user }) => useSessionStore.getState().setMe(user),
  });
}

/** Sign out everywhere locally, even if the request fails (e.g. offline). */
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout().catch(() => undefined),
    onSettled: () => {
      useSessionStore.getState().clear();
      qc.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) });
}

export function useResetPassword() {
  return useMutation({ mutationFn: ({ token, password }: { token: string; password: string }) => authApi.resetPassword(token, password) });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      const { me, patchMe } = useSessionStore.getState();
      if (me) patchMe({ emailVerified: true });
    },
  });
}

export function useResendVerification() {
  return useMutation({ mutationFn: () => authApi.resendVerification() });
}
