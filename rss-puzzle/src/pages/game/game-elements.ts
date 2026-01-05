import { createLevelAndRoundsSelector } from './levels/level-selection';
import { createElement } from '../../utils/create-element';

import type { GameElements } from '../../types/types';

export function createGameElements(): GameElements {
  const heading = createElement({ tag: 'p', className: 'result__heading', textContent: 'Result' });
  const settings = createElement({ tag: 'div', className: 'settings' });
  const levelSelection = createElement({ tag: 'div', className: 'level-selection' });

  const [levelDiv, roundDiv] = createLevelAndRoundsSelector();

  levelSelection.append(levelDiv, roundDiv);

  return { heading, settings, levelSelection, levelDiv, roundDiv };
}
