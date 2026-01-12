import { getCars } from '../../../api/garage/get-cars';
import { createCarDiv } from '../../../components/car/car';
import { errorPopup } from '../../../components/error/error';
import { appState } from '../../../state/app-state';
import { carState } from '../../../state/car-state';
import { eventState } from '../../../state/event-state';
import { clearContainer } from '../../../utils/clear-container';
import { createElement } from '../../../utils/create-element';
import { createRandomCars } from '../../../utils/generate-cars/generate-cars';

import type { GarageList } from '../../../types/types';

export const garageContainer = createElement({ tag: 'div', className: ['garage-container'] });

export const garageList: GarageList = ((): GarageList => {
  async function render(): Promise<void> {
    const { cars, totalCount } = await getCars(appState.garagePage, appState.perPage);

    carState.set(cars, totalCount);

    clearContainer(garageContainer);

    cars.forEach((car) => {
      garageContainer.append(createCarDiv(car));
    });

    eventState.emit('garage:pagination:update', {
      currentPage: appState.garagePage,
      totalCount: carState.totalCount,
    });
  }

  async function setPage(page: number): Promise<void> {
    const maxPage = Math.ceil(carState.totalCount / appState.perPage);

    if (page < 1 || page > maxPage) {
      return;
    }

    appState.garagePage = page;
    await render();

    eventState.emit('garage:pagination:update', {
      currentPage: appState.garagePage,
      totalCount: carState.totalCount,
    });
  }

  eventState.on('garage:refresh', async () => {
    await render();
  });

  eventState.on('garage:generate', async (quantity) => {
    try {
      await createRandomCars(quantity);
      await render();
    } catch {
      errorPopup.show('Failed to generate random cars');
    }
  });

  return { render, setPage };
})();
