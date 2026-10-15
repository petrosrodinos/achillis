import {
  ALLOWED_INPUT_CODES,
  DEFAULT_KEY_BINDINGS,
  GAME_ACTIONS,
  GameAction,
  KeyBindings,
  MAX_CODES_PER_ACTION,
} from '../config/settings.config';

const ACTION_SET: ReadonlySet<string> = new Set(GAME_ACTIONS);

/** Returns a list of validation errors for a (partial) key-binding object; empty when valid. */
export function validateKeyBindings(value: unknown): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return ['keyBindings must be an object'];
  }
  const errors: string[] = [];
  for (const [action, codes] of Object.entries(value)) {
    if (!ACTION_SET.has(action)) {
      errors.push(`keyBindings: unknown action "${action}"`);
      continue;
    }
    if (!Array.isArray(codes)) {
      errors.push(`keyBindings.${action} must be an array of input codes`);
      continue;
    }
    if (codes.length > MAX_CODES_PER_ACTION) {
      errors.push(
        `keyBindings.${action} accepts at most ${MAX_CODES_PER_ACTION} codes`,
      );
    }
    for (const code of codes) {
      if (typeof code !== 'string' || !ALLOWED_INPUT_CODES.has(code)) {
        errors.push(
          `keyBindings.${action}: unknown input code "${String(code)}"`,
        );
      }
    }
  }
  return errors;
}

/** Merges stored bindings (possibly from an older schema) with a partial update over defaults. */
export function mergeKeyBindings(
  stored: unknown,
  update?: Partial<KeyBindings>,
): KeyBindings {
  const base: KeyBindings = { ...DEFAULT_KEY_BINDINGS };
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    for (const action of GAME_ACTIONS) {
      const codes = (stored as Record<string, unknown>)[action];
      if (Array.isArray(codes))
        base[action] = codes.filter((c): c is string => typeof c === 'string');
    }
  }
  if (update) {
    for (const [action, codes] of Object.entries(update) as [
      GameAction,
      string[],
    ][]) {
      base[action] = Array.from(new Set(codes));
    }
  }
  return base;
}
