import type { Difficulty } from '@/content/ids';

export const DifficultyFormOptions: { value: Difficulty; label: string; description: string }[] = [
  { value: 'squire', label: 'Squire', description: 'Forgiving foes, slower attacks. For learning the ropes.' },
  { value: 'knight', label: 'Knight', description: 'The intended challenge.' },
  { value: 'champion', label: 'Champion', description: 'Relentless enemies. Bonus points for the brave.' },
];

export function getDifficultyLabel(d: Difficulty): string {
  return DifficultyFormOptions.find((o) => o.value === d)?.label ?? d;
}
