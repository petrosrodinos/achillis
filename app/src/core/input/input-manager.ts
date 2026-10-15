import type { GameAction } from '@/api/types';
import { getSettings } from '@/core/settings/settings-store';

/**
 * Keyboard + mouse input mapped through remappable bindings (settings store).
 * Tracks held codes and edge presses; the game loop consumes edges once per fixed step.
 */
class InputManager {
  private held = new Set<string>();
  private pressedEdges = new Set<string>();
  /** On-screen touch controls drive actions directly. */
  private virtualHeld = new Set<GameAction>();
  private virtualPressed = new Set<GameAction>();
  private attached = 0;
  private target: HTMLElement | null = null;
  /** Mouse position in normalised device coordinates (-1..1). */
  mouseNdc = { x: 0, y: 0 };
  /** Escape/pause presses (not remappable). */
  pausePressed = false;
  enabled = true;

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      this.pausePressed = true;
      return;
    }
    if (!this.enabled) return;
    if (this.isBound(e.code)) {
      // Keep Tab / Space / Shift from moving focus or scrolling during play.
      e.preventDefault();
    }
    if (!e.repeat) this.pressedEdges.add(e.code);
    this.held.add(e.code);
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.held.delete(e.code);
  };
  private onMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return;
    const code = `Mouse${e.button}`;
    this.held.add(code);
    this.pressedEdges.add(code);
    if (e.button === 1) e.preventDefault();
  };
  private onMouseUp = (e: MouseEvent) => {
    this.held.delete(`Mouse${e.button}`);
  };
  private onMouseMove = (e: MouseEvent) => {
    const el = this.target;
    if (!el) return;
    const r = el.getBoundingClientRect();
    this.mouseNdc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.mouseNdc.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  private onContextMenu = (e: Event) => e.preventDefault();
  private onBlur = () => {
    this.held.clear();
    this.virtualHeld.clear();
    this.pressedEdges.clear();
  };

  private isBound(code: string): boolean {
    const b = getSettings().keyBindings;
    for (const k in b) if (b[k as GameAction].includes(code)) return true;
    return false;
  }

  attach(target: HTMLElement) {
    this.target = target;
    if (this.attached++ > 0) return;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    target.addEventListener('mousedown', this.onMouseDown);
    target.addEventListener('contextmenu', this.onContextMenu);
    target.addEventListener('auxclick', this.onContextMenu);
  }

  detach() {
    if (--this.attached > 0) return;
    this.attached = 0;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.target?.removeEventListener('mousedown', this.onMouseDown);
    this.target?.removeEventListener('contextmenu', this.onContextMenu);
    this.target?.removeEventListener('auxclick', this.onContextMenu);
    this.target = null;
    this.reset();
  }

  reset() {
    this.held.clear();
    this.virtualHeld.clear();
    this.virtualPressed.clear();
    this.pressedEdges.clear();
    this.pausePressed = false;
  }

  /** Touch controls: hold/release an action. */
  setVirtual(action: GameAction, held: boolean) {
    if (held) {
      if (!this.virtualHeld.has(action)) this.virtualPressed.add(action);
      this.virtualHeld.add(action);
    } else this.virtualHeld.delete(action);
  }

  /** Touch controls: a one-shot press (tap). */
  tapVirtual(action: GameAction) {
    this.virtualPressed.add(action);
  }

  pausePress() {
    this.pausePressed = true;
  }

  isHeld(action: GameAction): boolean {
    if (!this.enabled) return false;
    if (this.virtualHeld.has(action)) return true;
    return getSettings().keyBindings[action].some((c) => this.held.has(c));
  }

  /** True if any binding of `action` was pressed since the last `endStep()`. */
  wasPressed(action: GameAction): boolean {
    if (!this.enabled) return false;
    if (this.virtualPressed.has(action)) return true;
    return getSettings().keyBindings[action].some((c) => this.pressedEdges.has(c));
  }

  /** Clear edge presses; call after a fixed step consumed them. */
  endStep() {
    this.pressedEdges.clear();
    this.virtualPressed.clear();
  }

  consumePause(): boolean {
    const p = this.pausePressed;
    this.pausePressed = false;
    return p;
  }
}

export const input = new InputManager();
