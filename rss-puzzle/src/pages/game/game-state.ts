import wordCollectionData from '../../data/word-collection-level-1.json';
import { checkElement } from '../../types/type-guards';

export type GameElements = {
  sourceContainer?: HTMLElement;
  resultContainer?: HTMLElement;
  resultPlaceholder?: HTMLElement;
  activeResultSentence?: HTMLElement;
  checkButton?: HTMLButtonElement;
  autoCompleteButton?: HTMLButtonElement;
  roundTitle?: HTMLElement;
};

export const gameState: {
  _roundIndex: number;
  _sentenceIndex: number;
  _isCompleted: boolean;
  _isSolved: boolean;
  _correctSentence: string[];
  _userSentence: string[];
  rounds: typeof wordCollectionData.rounds;
  elements: GameElements;

  sourceContainer: HTMLElement;
  resultContainer: HTMLElement;
  resultPlaceholder: HTMLElement;
  activeResultSentence: HTMLElement;
  checkButton: HTMLButtonElement;
  autoCompleteButton: HTMLButtonElement;
  roundTitle: HTMLElement;

  roundIndex: number;
  sentenceIndex: number;
  isCompleted: boolean;
  isSolved: boolean;
  correctSentence: string[];
  userSentence: string[];

  resetGame(): void;
  nextRound(): void;
} = {
  _roundIndex: 0,
  _sentenceIndex: 0,
  _isCompleted: false,
  _isSolved: false,
  _correctSentence: [],
  _userSentence: [],

  rounds: wordCollectionData.rounds,

  elements: {},

  get sourceContainer() {
    return checkElement(this.elements.sourceContainer, 'sourceContainer');
  },
  get resultContainer() {
    return checkElement(this.elements.resultContainer, 'resultContainer');
  },
  get resultPlaceholder() {
    return checkElement(this.elements.resultPlaceholder, 'resultPlaceholder');
  },
  get activeResultSentence() {
    return checkElement(this.elements.activeResultSentence, 'activeResultSentence');
  },
  get checkButton() {
    return checkElement(this.elements.checkButton, 'checkButton');
  },
  get autoCompleteButton() {
    return checkElement(this.elements.autoCompleteButton, 'autoCompleteButton');
  },
  get roundTitle() {
    return checkElement(this.elements.roundTitle, 'roundTitle');
  },

  get roundIndex() {
    return this._roundIndex;
  },
  set roundIndex(value: number) {
    this._roundIndex = value;
  },

  get sentenceIndex() {
    return this._sentenceIndex;
  },
  set sentenceIndex(value: number) {
    this._sentenceIndex = value;
  },

  get isCompleted() {
    return this._isCompleted;
  },
  set isCompleted(value: boolean) {
    this._isCompleted = value;
  },

  get isSolved() {
    return this._isSolved;
  },
  set isSolved(value: boolean) {
    this._isSolved = value;
  },

  get correctSentence() {
    return this._correctSentence;
  },
  set correctSentence(words: string[]) {
    this._correctSentence = words;
  },

  get userSentence() {
    return this._userSentence;
  },
  set userSentence(words: string[]) {
    this._userSentence = words;
  },

  resetGame(): void {
    this._roundIndex = 0;
    this._sentenceIndex = 0;
    this._isCompleted = false;
    this._correctSentence = [];
    this._userSentence = [];
  },

  nextRound(): void {
    this._roundIndex += 1;
    this._sentenceIndex = 0;
    this.correctSentence = [];
    this.isCompleted = false;
    this._isSolved = false;
  },
};
