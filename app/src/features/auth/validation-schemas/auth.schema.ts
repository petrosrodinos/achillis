import { z } from 'zod';

/** Rules mirror contracts §2.1 so the client rejects what the server would. */
export const USERNAME_RE = /^[A-Za-z0-9_]+$/;

export const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email address').max(254, 'Email is too long');

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(USERNAME_RE, 'Only letters, numbers and underscores');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[A-Za-z]/, 'Password needs at least one letter')
  .regex(/\d/, 'Password needs at least one number');

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
export type RegisterForm = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Enter your password'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });

/** Live checklist shown under the password field. */
export function passwordChecks(password: string): Array<{ id: string; label: string; ok: boolean }> {
  return [
    { id: 'len', label: '8–72 characters', ok: password.length >= 8 && password.length <= 72 },
    { id: 'letter', label: 'At least one letter', ok: /[A-Za-z]/.test(password) },
    { id: 'digit', label: 'At least one number', ok: /\d/.test(password) },
  ];
}

/** Flatten a zod error into `{ field: firstMessage }`. */
export function zodFieldErrors<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
  const out: Partial<Record<T, string>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_form') as T;
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
