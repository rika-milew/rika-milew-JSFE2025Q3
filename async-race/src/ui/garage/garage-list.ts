import { createCarDiv } from '../../components/car/car';
import { getCars } from '../../data/garage/get-cars';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';

import type { GarageList } from '../../types/types';

export function createGarageList(): GarageList {
  const container = createElement({ tag: 'div', className: 'garage-container' });

  async function render(): Promise<void> {
    container.innerHTML = '';

    try {
      const { cars } = await getCars();
      carState.set(cars);

      carState.cars.forEach((car) => {
        container.append(createCarDiv(car));
      });
    } catch (error) {
      console.error('Failed to create cars:', error);
    }
  }

  render().catch((error: unknown) => {
    console.error('Failed render:', error);
  });

  eventState.on('garage:refresh', () => {
    render().catch((error: unknown) => {
      console.error('Failed to refresh page:', error);
    });
  });

  return { container, render };
}
