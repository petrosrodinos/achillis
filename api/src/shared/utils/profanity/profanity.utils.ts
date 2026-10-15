import {
  ALLOWED_WORDS,
  BLOCKED_SUBSTRINGS,
  BLOCKED_TOKENS,
} from './profanity.words';

// Common leetspeak substitutions. `1` and `|` are ambiguous (i / l) so both readings are checked.
const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  $: 's',
  '!': 'i',
  '+': 't',
};

const AMBIGUOUS_ONE = ['i', 'l'];

/** Collapse every run of a repeated letter to a single letter (`fuuuck` → `fuck`). */
const collapseToOne = (value: string) => value.replace(/(.)\1+/g, '$1');
/** Collapse runs of 3+ to two letters (`niggger` → `nigger`), keeping legitimate doubles. */
const collapseToTwo = (value: string) => value.replace(/(.)\1{2,}/g, '$1$1');
const hasDoubleLetter = (value: string) => /(.)\1/.test(value);

// Words without double letters can be compared against the fully collapsed input; words that
// legitimately contain doubles (e.g. "ass") are only compared against the 2-collapsed input,
// otherwise harmless names would match ("as", "bob", "niger").
const SINGLE_SUBSTRINGS = BLOCKED_SUBSTRINGS.filter(
  (word) => !hasDoubleLetter(word),
);
const DOUBLE_SUBSTRINGS = BLOCKED_SUBSTRINGS.filter(hasDoubleLetter);
const SINGLE_TOKENS = new Set(
  BLOCKED_TOKENS.filter((word) => !hasDoubleLetter(word)),
);
const DOUBLE_TOKENS = new Set(
  BLOCKED_TOKENS.filter(hasDoubleLetter).map(collapseToTwo),
);

function leetVariants(raw: string): string[] {
  const lower = raw.toLowerCase();
  const variants = AMBIGUOUS_ONE.map((one) =>
    lower
      .split('')
      .map((char) =>
        char === '1' || char === '|' ? one : (LEET_MAP[char] ?? char),
      )
      .join(''),
  );
  return Array.from(new Set(variants));
}

function stripAllowed(value: string): string {
  return ALLOWED_WORDS.reduce((acc, word) => acc.split(word).join('-'), value);
}

function tokenIsBlocked(token: string): boolean {
  return (
    SINGLE_TOKENS.has(collapseToOne(token)) ||
    DOUBLE_TOKENS.has(collapseToTwo(token))
  );
}

function textContainsBlocked(text: string): boolean {
  const one = collapseToOne(text);
  const two = collapseToTwo(text);
  return (
    SINGLE_SUBSTRINGS.some((word) => one.includes(word)) ||
    DOUBLE_SUBSTRINGS.some((word) => two.includes(word))
  );
}

/**
 * Returns true when the given username contains profanity, after leetspeak normalisation,
 * separator removal and repeated-letter collapsing (e.g. `F_u_u_c_K`, `5h1t`, `b1tch`).
 */
export function containsProfanity(input: string): boolean {
  if (!input) return false;

  for (const variant of leetVariants(input)) {
    const tokens = variant.split(/[^a-z]+/).filter(Boolean);
    if (tokens.some(tokenIsBlocked)) return true;

    // Letters-only form defeats separators (`f_u_c_k`); harmless words are cut out first.
    const lettersOnly = stripAllowed(variant.replace(/[^a-z]/g, ''));
    if (lettersOnly.split('-').some(textContainsBlocked)) return true;
  }

  return false;
}
