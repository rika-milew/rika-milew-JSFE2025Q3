export type HintType = 'translation' | 'audio' | 'image';
const HINT_KEYS: HintType[] = ['translation', 'audio', 'image'];

export type HintMode = 'enabled' | 'disabled';

export type HintConfig = {
  mode: HintMode;
};

export type HintState = {
  hints: Record<HintType, HintConfig>;
  toggle(hint: HintType): void;
  setMode(hint: HintType, mode: HintMode): void;
  getMode(hint: HintType): HintMode;
  save(): void;
  reset(): void;
  upload(): void;
};

const LOCAL_STORAGE_KEY = 'hintState';

export const hintState: HintState = {
  hints: {
    translation: { mode: 'enabled' },
    audio: { mode: 'enabled' },
    image: { mode: 'enabled' },
  },

  toggle(hint) {
    const current = this.hints[hint].mode;
    this.hints[hint].mode = current === 'enabled' ? 'disabled' : 'enabled';
    this.save();
  },

  setMode(hint, mode) {
    this.hints[hint].mode = mode;
    this.save();
  },

  getMode(hint) {
    return this.hints[hint].mode;
  },

  save() {
    const hintData = JSON.stringify(this.hints);
    localStorage.setItem(LOCAL_STORAGE_KEY, hintData);
  },

  reset() {
    Object.entries(this.hints).forEach(([_, config]) => {
      config.mode = 'enabled';
    });
    this.save();
  },

  upload() {
    const hintData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hintData) {
      this.save();
      return;
    }

    let parsedHints: unknown;
    try {
      parsedHints = JSON.parse(hintData);
    } catch {
      return;
    }

    if (!isValidHint(parsedHints)) {
      return;
    }

    for (const key of HINT_KEYS) {
      const savedHint = parsedHints[key];
      const mode = savedHint.mode;
      if (isValidHintMode(mode)) {
        this.hints[key].mode = mode;
      }
    }
  },
};

function isValidHint(data: unknown): data is Record<string, { mode?: unknown }> {
  return typeof data === 'object' && data !== null;
}

function isValidHintMode(mode: unknown): mode is 'enabled' | 'disabled' {
  return mode === 'enabled' || mode === 'disabled';
}
