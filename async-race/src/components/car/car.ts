import { createEngineButtons } from '@/components/car/create-engine-buttons';
import { createButton } from '@/components/shared/button/button';
import { createCarImage } from '@/components/svg-paint/create-car-image';
import { createFlagImage } from '@/components/svg-paint/create-flag-image';
import { addCarStore } from '@/state/car-store';
import { eventState } from '@/state/events/event-state';
import { createElement } from '@/utils/create-element';

import type { Car } from '../../types/types';

import './car.css';

export function createCarElement(car: Car): HTMLDivElement {
  const carItem: HTMLDivElement = createElement({ tag: 'div', className: ['car'] });

  const carButtons: HTMLDivElement = createCarButtons(car);
  const engineButtons: HTMLDivElement = createEngineButtons(car);

  const { element: carSvg, setColor }: { element: SVGElement; setColor: (color: string) => void } =
    createCarImage(car.color);

  eventState.on('updateform:color', (payload: { id: number; color: string } | undefined) => {
    if (!payload) {
      return;
    }

    if (payload.id === car.id) {
      setColor(payload.color);
    }
  });

  const carTrack: HTMLDivElement = createElement({
    tag: 'div',
    className: ['car__track'],
  });

  const trackLine: HTMLDivElement = createElement({
    tag: 'div',
    className: ['car__track-line'],
  });

  const finishFlag: HTMLImageElement = createFlagImage();

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
  const selectButton: HTMLButtonElement = createButton({
    text: 'Select',
    className: 'car-button',
  });

  const removeButton: HTMLButtonElement = createButton({
    text: 'Remove',
    className: 'car-button',
  });

  const carName: HTMLParagraphElement = createElement({
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

  const container: HTMLDivElement = createElement({ tag: 'div', className: ['car-buttons'] });
  container.append(selectButton, removeButton, carName);

  return container;
}
