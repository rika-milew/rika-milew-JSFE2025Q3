import { createButton } from '@components/button/button';
import { engineButtons } from '@state/engine-buttons';
import { eventState } from '@state/events/event-state';
import { createElement } from '@utils/create-element';
import { setEngineButtons } from '@utils/set-car-buttons';

import type { Car } from '../../types/types';

export function createEngineButtons(car: Car): HTMLDivElement {
  const startButton = createButton({
    text: 'Start',
    className: 'animation-button start-button',
  });

  startButton.addEventListener('click', () => {
    eventState.emit('car:start', { id: car.id });
  });

  const resetButton = createButton({
    text: 'Reset',
    className: 'animation-button stop-button',
  });

  resetButton.addEventListener('click', () => {
    eventState.emit('car:reset', { id: car.id });
  });

  engineButtons[car.id] = { startButton, resetButton };
  setEngineButtons(car.id, true, false);

  const container = createElement({ tag: 'div', className: ['animation-buttons'] });
  container.append(startButton, resetButton);

  return container;
}
