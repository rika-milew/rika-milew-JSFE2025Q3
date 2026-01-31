import { createCarElement } from '@/components/car/car';
import { resetAllCarsPositions } from '@/components/car/car-animation/reset-car-position';
import { appState } from '@/state/app-state';
import { carState } from '@/state/car-state';
import { eventState } from '@/state/events/event-state';
import { createElement } from '@/utils/create-element';
import { createRandomCars } from '@/utils/generate-cars';

import type { GarageList, Car } from '@/types/types';

export const garageContainer = createElement({ tag: 'div', className: ['garage-container'] });

export const garageList: GarageList = ((): GarageList => {
  function render(): void {
    const start = (appState.garagePage - 1) * appState.perPage;
    const end = start + appState.perPage;

    const cars = carState.cars.slice(start, end);

    resetAllCarsPositions();

    garageContainer.replaceChildren();

    if (cars.length === 0) {
      renderEmpty();
      return;
    }

    cars.forEach((car) => {
      garageContainer.append(createCarElement(car));
    });

    eventState.emit('garage:pagination:update', {
      currentPage: appState.garagePage,
      totalCount: carState.totalCount,
    });
  }

  function renderEmpty(): void {
    garageContainer.replaceChildren();

    const emptyGarage = createElement({
      tag: 'p',
      className: ['garage-empty'],
      textContent: 'Your garage is empty. Add a car to get started!',
    });

    garageContainer.append(emptyGarage);

    eventState.emit('garage:pagination:update', {
      currentPage: 1,
      totalCount: 0,
    });
  }

  function setPage(page: number): void {
    const maxPage = Math.ceil(carState.totalCount / appState.perPage);

    if (page < 1 || page > maxPage) {
      return;
    }

    appState.garagePage = page;
    render();

    eventState.emit('garage:pagination:update', {
      currentPage: appState.garagePage,
      totalCount: carState.totalCount,
    });
  }

  eventState.on('garage:refresh', () => {
    render();
  });

  eventState.on('garage:generate', async (quantity) => {
    const newCars: Car[] | undefined = await createRandomCars(quantity);

    newCars.forEach((car) => {
      carState.add(car);
    });

    eventState.emit('garage:refresh');
  });

  return { render, renderEmpty, setPage };
})();
