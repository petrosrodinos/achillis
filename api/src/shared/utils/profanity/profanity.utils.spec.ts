import { containsProfanity } from './profanity.utils';

describe('containsProfanity', () => {
  it.each([
    'Fuck',
    'xXfuckerXx',
    'F_u_c_K',
    'fuuuuck',
    'sh1t',
    '5hit',
    'b1tch',
    'B!tch_99',
    'a55hole',
    'n1gger',
    'my_ass',
    'big_c0ck',
    'Kkk',
  ])('blocks %s', (name) => expect(containsProfanity(name)).toBe(true));

  it.each([
    'Sir_Galahad',
    'WhiteKnight',
    'Scunthorpe_FC',
    'Classic_Knight',
    'Bass_Player',
    'Assassin42',
    'Cockpit_Ace',
    'Peacock',
    'Bobby',
    'Titan_Fall',
    'Grape_Juice',
    'Therapist',
    'Hancock',
    'Niger_River',
    'Lancelot_1',
  ])('allows %s', (name) => expect(containsProfanity(name)).toBe(false));

  it('handles empty input', () => expect(containsProfanity('')).toBe(false));
});
