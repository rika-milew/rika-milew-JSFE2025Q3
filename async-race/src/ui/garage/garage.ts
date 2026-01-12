import { createGarageButtons } from './garage-buttons/garage-buttons';
import { startGarageController } from './helpers/garage-controller';
import { garageContainer, garageList } from './helpers/garage-list';
import { implementPagination } from './helpers/garage-pagination';
import { loadDefaultCars } from './helpers/init-garage';
import { infoElements } from './info-elements';
import { createCarForm } from '../../components/car-form/car-form';
import { appState } from '../../state/app-state';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';

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
    onPrev: async () => {
      await garageList.setPage(appState.garagePage - 1);
    },
    onNext: async () => {
      await garageList.setPage(appState.garagePage + 1);
    },
  });

  container.append(paginationContainer);

  await loadDefaultCars();

  // console.log(carState);

  if (!container.contains(garageContainer)) {
    container.append(garageContainer);
  }

  startGarageController();

  eventState.on('garage:pagination:update', () => {
    const { garagePage } = appState;
    const totalCount = carState.totalCount;

    const maxPage = Math.ceil(totalCount / appState.perPage);

    previousButton.disabled = garagePage === 1;
    nextButton.disabled = garagePage === maxPage || maxPage === 0;
  });

  eventState.emit('garage:refresh');
}
