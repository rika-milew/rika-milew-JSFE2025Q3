import { gameState } from './state/game-state';

import type { Round, Sentence } from '../../types/types';

export function updateGameStateData(updatedRound: Round, currentSentence: Sentence): void {
  gameState.levelImage = updatedRound.levelData.imageSrc;
  gameState.imageName = updatedRound.levelData.name;
  gameState.cutImage = updatedRound.levelData.cutSrc;
  gameState.author = updatedRound.levelData.author;
  gameState.year = updatedRound.levelData.year;
  gameState.audioSource = currentSentence.audioExample;

  gameState.correctSentence = currentSentence.textExample.split(' ');
  const words = currentSentence.textExample.split(' ');
  gameState.correctSentenceIndexes = words.map((_, index) => index);
}
