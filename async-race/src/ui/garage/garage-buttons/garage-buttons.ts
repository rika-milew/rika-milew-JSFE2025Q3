import { createButton } from '@/components/shared/button/button';
import { CARS_QUANTITY } from '@/constants/constants';
import { eventState } from '@/state/events/event-state';
import { createElement } from '@/utils/create-element';
import { garageButtons } from '@/utils/set-garage-buttons';

import './garage-buttons.css';

export function createGarageButtons(): HTMLDivElement {
  const container: HTMLDivElement = createElement({ tag: 'div', className: ['garage__buttons'] });

  const raceButton: HTMLButtonElement = createButton({
    text: 'Race',
    className: 'race-button',
  });

  const resetButton: HTMLButtonElement = createButton({
    text: 'Reset',
    className: 'race-button',
  });

  const generateButton: HTMLButtonElement = createButton({
    text: 'Generate Cars',
    className: 'race-button',
  });

  garageButtons.race = raceButton;
  garageButtons.reset = resetButton;
  garageButtons.generate = generateButton;

  container.append(raceButton, resetButton, generateButton);

  raceButton.addEventListener('click', () => {
    eventState.emit('garage:race');
  });

  resetButton.addEventListener('click', () => {
    eventState.emit('garage:reset');
  });

  generateButton.addEventListener('click', () => {
    eventState.emit('garage:generate', CARS_QUANTITY);
  });

  return container;
}
