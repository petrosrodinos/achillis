import { useSyncExternalStore } from 'react';
import { outbox } from '@/api/outbox';

let cached = -1;
const listeners = new Set<() => void>();
outbox.subscribe(() => {
  cached = -1;
  listeners.forEach((l) => l());
});

function getCount(): number {
  if (cached < 0) cached = outbox.pending().length;
  return cached;
}

/** Number of mission results waiting in the offline outbox. */
export function useOutboxPending(): number {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getCount,
    () => 0,
  );
}
