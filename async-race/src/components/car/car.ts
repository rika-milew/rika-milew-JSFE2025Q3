import { createCarSvg, createFinishFlag } from './car-svg';
import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';
import { createButton } from '../button/button';

import type { Car } from '../../types/types';

import './car.css';

export function createCarDiv(car: Car): HTMLDivElement {
  const carItem = createElement({ tag: 'div', className: ['car'] });
  const carButtons = createElement({ tag: 'div', className: ['car-buttons'] });
  const animationButtons = createElement({ tag: 'div', className: ['animation-buttons'] });

  const carName = createElement({
    tag: 'p',
    className: ['car__name'],
    textContent: car.name,
  });

  const selectButton = createButton({
    text: 'Select',
    className: 'car-button',
  });

  const removeButton = createButton({
    text: 'Remove',
    className: 'car-button',
  });

  selectButton.addEventListener('click', () => {
    eventState.emit('updateform:fill', { id: car.id, name: car.name, color: car.color });
  });

  removeButton.addEventListener('click', () => {
    eventState.emit('car:delete', { id: car.id });
  });

  const startButton = createButton({
    text: 'Start',
    className: 'animation-button start-button',
  });

  const stopButton = createButton({
    text: 'Stop',
    className: 'animation-button stop-button',
  });

  const { element: carSvg, setColor } = createCarSvg(car.color);

  eventState.on('updateform:color', (payload) => {
    if (!payload) {
      return;
    }
    const { id, color } = payload;
    if (id === car.id) {
      setColor(color);
    }
  });

  const carTrack = createElement({
    tag: 'div',
    className: ['car__track'],
  });

  const finishFlag = createFinishFlag();

  carTrack.append(finishFlag);
  carButtons.append(selectButton, removeButton, carName);
  animationButtons.append(startButton, stopButton);
  carItem.append(carButtons, animationButtons, carSvg, carTrack);

  return carItem;
}
