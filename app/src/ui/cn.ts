import { clsx, type ClassValue } from 'clsx';

/** Join class names (clsx). No tailwind-merge: components avoid conflicting utilities by design. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
