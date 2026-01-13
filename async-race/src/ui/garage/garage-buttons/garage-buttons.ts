import { createButton } from '../../../components/button/button';
import { eventState } from '../../../state/events/event-state';
import { createElement } from '../../../utils/create-element';

import './garage-buttons.css';

export function createGarageButtons(): HTMLDivElement {
  const container = createElement({ tag: 'div', className: ['garage__buttons'] });

  const raceButton = createButton({
    text: 'Race',
    className: 'race-button',
  });

  const resetButton = createButton({
    text: 'Reset',
    className: 'race-button',
  });

  const generateButton = createButton({
    text: 'Generate Cars',
    className: 'race-button',
  });

  container.append(raceButton, resetButton, generateButton);

  raceButton.addEventListener('click', () => {
    eventState.emit('garage:race');
  });

  resetButton.addEventListener('click', () => {
    eventState.emit('garage:reset');
  });

  generateButton.addEventListener('click', () => {
    const CARS_QUANTITY = 100;
    eventState.emit('garage:generate', CARS_QUANTITY);
  });

  return container;
}
