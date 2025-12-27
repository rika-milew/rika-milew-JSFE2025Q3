export type HintType = 'translation' | 'audio' | 'image';

export type HintMode = 'enabled' | 'disabled';

export type HintConfig = {
  mode: HintMode;
};

export type HintState = {
  hints: Record<HintType, HintConfig>;
  toggle(hint: HintType): void;
  setMode(hint: HintType, mode: HintMode): void;
  getMode(hint: HintType): HintMode;
};

export const hintState: HintState = {
  hints: {
    translation: { mode: 'enabled' },
    audio: { mode: 'enabled' },
    image: { mode: 'enabled' },
  },

  toggle(hint) {
    const current = this.hints[hint].mode;
    this.hints[hint].mode = current === 'enabled' ? 'disabled' : 'enabled';
  },

  setMode(hint, mode) {
    this.hints[hint].mode = mode;
  },

  getMode(hint) {
    return this.hints[hint].mode;
  },
};
