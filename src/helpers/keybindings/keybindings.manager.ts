// KeybindingManager.ts

type TKeyBindingCallback = (event: KeyboardEvent) => void;

interface IKeyBinding {
  keyCombo: string;
  callback: TKeyBindingCallback;
}

const forcedKeyCombos: string[] = [
  "ArrowUp",
  "ArrowDown",
  "Enter",
  "Meta+Shift+c",
  "Meta+1",
  "Meta+2",
  "Meta+3",
  "Meta+4",
  "Meta+5",
  "Meta+6",
  "Meta+7",
  "Meta+8",
  "Meta+9",
  "Meta+0",
  "Meta+Shift+a",
  "Meta+Shift+1",
  "Meta+Shift+2",
  "Meta+Shift+3",
  "Meta+Shift+4",
  "Meta+Shift+5",
  "Meta+Shift+6",
  "Meta+Shift+7",
  "Meta+Shift+8",
  "Meta+Shift+9"
];

class _KeybindingManager {
  private static instance: _KeybindingManager;
  private bindings: { [keyCombo: string]: IKeyBinding[] } = {};

  private constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  public static getInstance(): _KeybindingManager {
    if (!_KeybindingManager.instance) {
      _KeybindingManager.instance = new _KeybindingManager();
    }
    return _KeybindingManager.instance;
  }

  public registerKeybinding(
    keyCombos: string | string[],
    callback: TKeyBindingCallback,
  ): void {
    const combos = Array.isArray(keyCombos) ? keyCombos : [keyCombos];

    combos.forEach((combo) => {
      if (!this.bindings[combo]) {
        this.bindings[combo] = [];
      }
      this.bindings[combo].push({ keyCombo: combo, callback });
    });
  }

  public unregisterKeybinding(
    keyCombos: string | string[],
    callback: TKeyBindingCallback,
  ): void {
    const combos = Array.isArray(keyCombos) ? keyCombos : [keyCombos];

    combos.forEach((combo) => {
      if (this.bindings[combo]) {
        this.bindings[combo] = this.bindings[combo].filter(
          (binding) => binding.callback !== callback,
        );
        if (this.bindings[combo].length === 0) {
          delete this.bindings[combo];
        }
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement;
    const isTypingContext =
      activeElement?.tagName === "INPUT" ||
      activeElement?.tagName === "TEXTAREA" ||
      activeElement?.isContentEditable;

    const keyCombo = this.getKeyCombo(event);

    if (isTypingContext && !forcedKeyCombos.includes(keyCombo)) {
      return;
    }

    if (this.bindings[keyCombo]) {
      this.bindings[keyCombo].forEach((binding) => binding.callback(event));
    }
  }

  private getKeyCombo(event: KeyboardEvent): string {
    const keys = [];

    if (event.metaKey || event.ctrlKey) keys.push("Meta");
    if (event.altKey) keys.push("Alt");
    if (event.shiftKey) keys.push("Shift");
    keys.push(event.key === " " ? "Space" : event.key);

    return keys.join("+");
  }
}

export const KeybindingManager = _KeybindingManager.getInstance();
