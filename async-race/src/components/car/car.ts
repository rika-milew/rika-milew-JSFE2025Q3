import { createButton } from '@components/button/button';
import { createCarSvg, createFinishFlag } from '@components/car/car-svg';
import { carElements } from '@state/car-elements';
import { engineButtons } from '@state/engine-buttons';
import { eventState } from '@state/events/event-state';
import { createElement } from '@utils/create-element';
import { setEngineButtons } from '@utils/set-car-buttons';

import type { Car } from '../../types/types';

import './car.css';

export function createCarElement(car: Car): HTMLDivElement {
  const carItem = createElement({ tag: 'div', className: ['car'] });

  const carButtons = createCarButtons(car);
  const animationButtons = createEngineButtons(car);

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

  const trackLine = createElement({
    tag: 'div',
    className: ['car__track-line'],
  });

  const finishFlag = createFinishFlag();

  carElements[car.id] = {
    container: carItem,
    svg: carSvg,
    track: carTrack,
    trackLine: trackLine,
    finish: finishFlag,
  };

  carTrack.append(trackLine, carSvg, finishFlag);
  carItem.append(carButtons, animationButtons, carTrack);

  return carItem;
}

function createCarButtons(car: Car): HTMLDivElement {
  const selectButton = createButton({
    text: 'Select',
    className: 'car-button',
  });

  const removeButton = createButton({
    text: 'Remove',
    className: 'car-button',
  });

  const carName = createElement({
    tag: 'p',
    className: ['car__name'],
    textContent: car.name,
  });

  selectButton.addEventListener('click', () => {
    eventState.emit('updateform:fill', { id: car.id, name: car.name, color: car.color });
  });

  removeButton.addEventListener('click', () => {
    eventState.emit('car:delete', { id: car.id });
  });

  const container = createElement({ tag: 'div', className: ['car-buttons'] });
  container.append(selectButton, removeButton, carName);

  return container;
}

function createEngineButtons(car: Car): HTMLDivElement {
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
