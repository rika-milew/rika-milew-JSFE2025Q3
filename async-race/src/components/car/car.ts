import { createButton } from '@/components/button/button';
import { createEngineButtons } from '@/components/car/create-engine-buttons';
import { createCarImage } from '@/components/svg-paint/create-car-image';
import { createFlagImage } from '@/components/svg-paint/create-flag-image';
import { addCarStore } from '@/state/car-store';
import { eventState } from '@/state/events/event-state';
import { createElement } from '@/utils/create-element';

import type { Car } from '../../types/types';

import './car.css';

export function createCarElement(car: Car): HTMLDivElement {
  const carItem = createElement({ tag: 'div', className: ['car'] });

  const carButtons = createCarButtons(car);
  const engineButtons = createEngineButtons(car);

  const { element: carSvg, setColor } = createCarImage(car.color);

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

  const finishFlag = createFlagImage();

  addCarStore(car.id, {
    container: carItem,
    svg: carSvg,
    track: carTrack,
    trackLine,
    finish: finishFlag,
  });

  carTrack.append(trackLine, carSvg, finishFlag);
  carItem.append(carButtons, engineButtons, carTrack);

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
