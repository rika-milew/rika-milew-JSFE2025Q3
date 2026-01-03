import { levels } from './levels/level-storage';

import type { Game } from '../../types/types';

export const gameState: {
  _levelIndex: number;
  _levelRounds: number;
  _roundIndex: number;
  _sentenceIndex: number;
  _isCompleted: boolean;
  _isSolved: boolean;
  _correctSentence: string[];
  _userSentence: string[];

  levelIndex: number;
  levelRounds: number;
  roundIndex: number;
  sentenceIndex: number;
  isCompleted: boolean;
  isSolved: boolean;
  correctSentence: string[];
  userSentence: string[];
  audioSrc: string;
  levelImage: string;
  imageName: string;
  cutImage: string;
  author: string;
  year: string;

  resetGame(): void;
  nextLevel(): void;
  nextRound(): void;
  nextSentence(): void;

  currentLevel: Game;
} = {
  _levelIndex: 0,
  _levelRounds: 0,
  _roundIndex: 0,
  _sentenceIndex: 0,
  _isCompleted: false,
  _isSolved: false,
  _correctSentence: [],
  _userSentence: [],
  audioSrc: '',
  levelImage: '',
  imageName: '',
  cutImage: '',
  author: '',
  year: '',

  get levelIndex() {
    return this._levelIndex;
  },
  set levelIndex(value: number) {
    this._levelIndex = value;
  },

  get currentLevel(): Game {
    return levels[this._levelIndex];
  },

  get levelRounds() {
    return this._levelRounds;
  },

  set levelRounds(value: number) {
    this._levelRounds = value;
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
    this._levelIndex = 0;
    this._roundIndex = 0;
    this._sentenceIndex = 0;
    this._isCompleted = false;
    this._correctSentence = [];
    this._userSentence = [];
  },

  nextLevel(): void {
    this._levelIndex += 1;
    this._roundIndex = 0;
    this._sentenceIndex = 0;
    this.correctSentence = [];
    this.isCompleted = false;
    this._isSolved = false;
  },

  nextRound(): void {
    this._roundIndex += 1;
    this._sentenceIndex = 0;
    this.correctSentence = [];
    this.isCompleted = false;
    this._isSolved = false;
  },

  nextSentence(): void {
    this._sentenceIndex += 1;
    this.correctSentence = [];
    this.isCompleted = false;
    this._isSolved = false;
  },
};
