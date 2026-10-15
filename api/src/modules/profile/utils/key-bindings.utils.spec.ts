import { DEFAULT_KEY_BINDINGS } from '../config/settings.config';
import { mergeKeyBindings, validateKeyBindings } from './key-bindings.utils';

describe('key bindings', () => {
  it('accepts the defaults and partial updates', () => {
    expect(validateKeyBindings(DEFAULT_KEY_BINDINGS)).toEqual([]);
    expect(validateKeyBindings({ dodge: ['KeyX', 'Mouse1'] })).toEqual([]);
  });

  it('rejects unknown actions, unknown codes, Escape and non-arrays', () => {
    expect(validateKeyBindings({ fly: ['KeyW'] })[0]).toContain(
      'unknown action',
    );
    expect(validateKeyBindings({ dodge: ['Key1'] })[0]).toContain(
      'unknown input code',
    );
    expect(validateKeyBindings({ dodge: ['Escape'] })[0]).toContain(
      'unknown input code',
    );
    expect(validateKeyBindings({ dodge: 'Space' })[0]).toContain(
      'must be an array',
    );
    expect(
      validateKeyBindings({
        dodge: ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE'],
      })[0],
    ).toContain('at most');
    expect(validateKeyBindings([])).toEqual(['keyBindings must be an object']);
  });

  it('merges partial updates over stored bindings and defaults', () => {
    const merged = mergeKeyBindings(
      { dodge: ['KeyZ'] },
      { block: ['KeyB', 'KeyB'] },
    );
    expect(merged.dodge).toEqual(['KeyZ']);
    expect(merged.block).toEqual(['KeyB']);
    expect(merged.moveUp).toEqual(['KeyW']);
  });
});
