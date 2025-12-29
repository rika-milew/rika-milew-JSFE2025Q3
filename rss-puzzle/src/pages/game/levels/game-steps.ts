import { gameState } from '../game-state';
import { levels } from './level-storage';
import { markRounds } from '../../../utils/mark-rounds';
import { eventState } from '../event-state';

type NextStep = 'sentence' | 'round' | 'level' | 'gameover';

export function launchNextStep(): NextStep {
  const level = levels[gameState.levelIndex];
  const round = level.rounds[gameState.roundIndex];

  if (gameState.sentenceIndex < round.words.length - 1) {
    gameState.nextSentence();
    return 'sentence';
  }

  if (gameState.roundIndex < level.rounds.length - 1) {
    markRounds();
    gameState.nextRound();
    eventState.emit('round:changed', gameState.roundIndex);
    return 'round';
  }

  if (gameState.levelIndex < levels.length - 1) {
    markRounds();
    gameState.nextLevel();
    eventState.emit('level:changed', gameState.levelIndex);
    return 'level';
  }

  gameState.isCompleted = true;
  return 'gameover';
}
