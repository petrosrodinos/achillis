/** Thousands-separated integer, e.g. 12,450. */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-GB');
}

/** Mission time, e.g. 3:07.4 (or 1:02:03 for very long runs). Null → "—". */
export function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return '—';
  const totalTenths = Math.max(0, Math.round(ms / 100));
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`;
  return `${m}:${ss}.${tenths}`;
}

/** Roman numeral for mission numbers (1–39). */
export function toRoman(n: number): string {
  const table: Array<[number, string]> = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let rest = n;
  for (const [v, s] of table) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}
