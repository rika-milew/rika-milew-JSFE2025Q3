import { createCarForm } from '@components/car-form/car-form';
import { startEngineController } from '@controller/engine-controller';
import { startGarageController } from '@controller/garage-controller';
import { startRaceController } from '@controller/race-controller';
import { appState } from '@state/app-state';
import { carState } from '@state/car-state';
import { eventState } from '@state/events/event-state';
import { createGarageButtons } from '@ui/garage/garage-buttons/garage-buttons';
import { garageContainer, garageList } from '@ui/garage/helpers/garage-list';
import { implementPagination } from '@ui/garage/helpers/garage-pagination';
import { loadDefaultCars } from '@ui/garage/helpers/init-garage';
import { infoElements } from '@ui/garage/info-elements';
import { createElement } from '@utils/create-element';

import './garage.css';

export async function createGarage(): Promise<void> {
  const main = createElement({ tag: 'div', className: ['main'] });
  const container = createElement({ tag: 'div', className: ['container'] });

  document.body.append(main);
  main.append(container);

  if (!container.contains(infoElements.container)) {
    container.append(infoElements.container);
  }

  const formsContainer = createElement({ tag: 'div', className: ['form-container'] });
  container.append(formsContainer);

  const createForm = createCarForm({ isUpdate: false });
  const updateForm = createCarForm({ isUpdate: true, disabled: true });

  formsContainer.append(createForm, updateForm);

  const garageButtons = createGarageButtons();
  formsContainer.append(garageButtons);

  const { paginationContainer, previousButton, nextButton } = implementPagination({
    onPrev: () => {
      garageList.setPage(appState.garagePage - 1);
    },
    onNext: () => {
      garageList.setPage(appState.garagePage + 1);
    },
  });

  container.append(paginationContainer);

  await loadDefaultCars();

  if (!container.contains(garageContainer)) {
    container.append(garageContainer);
  }

  // console.log(carState);
  startGarageController();
  startEngineController();
  startRaceController();

  eventState.on('garage:pagination:update', () => {
    const { garagePage } = appState;
    const totalCount = carState.totalCount;

    const maxPage = Math.ceil(totalCount / appState.perPage);

    previousButton.disabled = garagePage === 1;
    nextButton.disabled = garagePage === maxPage || maxPage === 0;
  });

  eventState.emit('garage:refresh');
}
