import { describe, expect, it } from 'vitest';
import { evaluateDeviceSupport } from './use-device-support';

describe('evaluateDeviceSupport', () => {
  it('desktop is ok', () => {
    expect(evaluateDeviceSupport(1280, 720, true, false)).toMatchObject({ status: 'ok', supported: true, rotate: false, isTouch: false });
  });

  it('tablets and touch devices are supported', () => {
    expect(evaluateDeviceSupport(1024, 768, true, true)).toMatchObject({ status: 'ok', supported: true, isTouch: true });
  });

  it('phone in landscape is ok, in portrait asks to rotate', () => {
    expect(evaluateDeviceSupport(844, 390, true, true).status).toBe('ok');
    expect(evaluateDeviceSupport(390, 844, true, true)).toMatchObject({ status: 'rotate', supported: true, rotate: true });
  });

  it('portrait tablets wider than 900 do not need to rotate', () => {
    expect(evaluateDeviceSupport(1024, 1366, true, true).status).toBe('ok');
  });

  it('blocks tiny viewports and missing WebGL2', () => {
    expect(evaluateDeviceSupport(500, 300, true, false)).toMatchObject({ status: 'unsupported', reasons: ['viewport'] });
    expect(evaluateDeviceSupport(1920, 1080, false, false)).toMatchObject({ status: 'unsupported', supported: false, reasons: ['webgl2'] });
  });
});
