import { createCarForm } from '@/components/car-form/car-form';
import { createPageNumber } from '@/components/page-number/page-number';
import { startEngineController } from '@/controller/engine-controller';
import { startGarageController } from '@/controller/garage-controller';
import { startRaceController } from '@/controller/race-controller';
import { startWinnersController } from '@/controller/winners-controller';
import { appState } from '@/state/app-state';
import { carState } from '@/state/car-state';
import { eventState } from '@/state/events/event-state';
import { createGarageButtons } from '@/ui/garage/garage-buttons/garage-buttons';
import { garageContainer, garageList } from '@/ui/garage/helpers/garage-list';
import { implementPagination } from '@/ui/garage/helpers/garage-pagination';
import { loadDefaultCars } from '@/ui/garage/helpers/init-garage';
import { loadWinners } from '@/ui/winners/helpers/load-winners';
import { createElement } from '@/utils/create-element';

import type { PaginationElements, PageInfoResults } from '@/types/types';

import './garage.css';

export async function createGarage(): Promise<void> {
  const main: HTMLDivElement = createElement({ tag: 'div', className: ['main'] });
  const container: HTMLDivElement = createElement({ tag: 'div', className: ['container'] });

  document.body.append(main);
  main.append(container);

  if (!container.contains(infoElements.container)) {
    container.append(infoElements.container);
  }

  const formsContainer: HTMLDivElement = createElement({
    tag: 'div',
    className: ['form-container'],
  });
  container.append(formsContainer);

  const createForm: HTMLFormElement = createCarForm({ isUpdate: false });
  const updateForm: HTMLFormElement = createCarForm({ isUpdate: true, disabled: true });

  formsContainer.append(createForm, updateForm);

  const garageButtons: HTMLDivElement = createGarageButtons();
  formsContainer.append(garageButtons);

  const { paginationContainer, previousButton, nextButton }: PaginationElements =
    implementPagination({
      onPrev: () => {
        garageList.setPage(appState.garagePage - 1);
      },
      onNext: () => {
        garageList.setPage(appState.garagePage + 1);
      },
    });

  container.append(paginationContainer);

  await loadDefaultCars();
  await loadWinners();

  if (!container.contains(garageContainer)) {
    container.append(garageContainer);
  }

  startGarageController();
  startEngineController();
  startRaceController();
  startWinnersController();

  eventState.on('garage:pagination:update', () => {
    const { garagePage }: { garagePage: number } = appState;
    const totalCount: number = carState.totalCount;

    const maxPage: number = Math.ceil(totalCount / appState.perPage);

    previousButton.disabled = garagePage === 1;
    nextButton.disabled = garagePage === maxPage || maxPage === 0;
  });

  eventState.emit('garage:refresh');
}

export const infoElements: PageInfoResults = createPageNumber({
  title: 'Garage',
  page: appState.garagePage,
  total: carState.cars.length,
  totalText: 'Total Cars',
});

eventState.on('garage:refresh', () => {
  infoElements.totalInfo.textContent = `Total Cars: ${carState.totalCount}`;
});

eventState.on(
  'garage:pagination:update',
  (data: { currentPage: number; totalCount: number } | undefined) => {
    if (!data) {
      return;
    }

    const { currentPage, totalCount } = data;
    infoElements.totalInfo.textContent = `Total Cars: ${totalCount}`;
    infoElements.pageInfo.textContent = `Page: ${currentPage} / ${Math.ceil(totalCount / appState.perPage) || 1}`;
  },
);
