export type GameStateType = {
  _roundIndex: number;
  _sentenceIndex: number;
  _isCompleted: boolean;
  _correctSentence: string[];
  _userSentence: string[];
};

export const gameState = {
  _roundIndex: 0,
  _sentenceIndex: 0,
  _isCompleted: false,
  _correctSentence: new Array<string>(),
  _userSentence: new Array<string>(),

  get roundIndex(): number {
    return this._roundIndex;
  },

  get sentenceIndex(): number {
    return this._sentenceIndex;
  },

  get isCompleted(): boolean {
    return this._isCompleted;
  },

  get correctSentence(): string[] {
    return this._correctSentence;
  },

  get userSentence(): string[] {
    return this._userSentence;
  },

  set roundIndex(value: number) {
    this._roundIndex = value;
  },

  set sentenceIndex(value: number) {
    this._sentenceIndex = value;
  },

  set isCompleted(value: boolean) {
    this._isCompleted = value;
  },

  set correctSentence(words: string[]) {
    this._correctSentence = words;
  },

  set userSentence(words: string[]) {
    this._userSentence = words;
  },
};
