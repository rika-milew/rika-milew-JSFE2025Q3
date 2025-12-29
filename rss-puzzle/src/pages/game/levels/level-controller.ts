import { gameState } from '../game-state';
import { levels } from './level-storage';

import type { Game, Round, Word } from '../../../types/types';

export function initRound(game: Game): {
  level: Game;
  round: Round;
  currentSentence: Word;
} {
  const level = levels[gameState.levelIndex];
  const round = game.rounds[gameState.roundIndex];
  const currentSentence = round.words[gameState.sentenceIndex];
  gameState.correctSentence = currentSentence.textExample.split(' ');

  return { level, round, currentSentence };
}
