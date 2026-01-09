import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';
import { createButton } from '../button/button';

import type { Car } from '../../types/types';

export function createCarDiv(car: Car): HTMLDivElement {
  const carItem = createElement({ tag: 'div', className: 'car' });

  const carName = createElement({
    tag: 'p',
    className: 'car__name',
    textContent: `Name: ${car.name}`,
  });

  const carColor = createElement({
    tag: 'p',
    className: 'car__color',
    textContent: `Color: ${car.color}`,
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

  carItem.append(carName, carColor, selectButton, removeButton);

  return carItem;
}
