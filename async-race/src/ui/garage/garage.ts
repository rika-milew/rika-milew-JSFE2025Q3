import { startGarageController } from './garage-controller';
import { createGarageList } from './garage-list';
import { createCarForm } from '../../components/car-form/car-form';
import { createInfoElements } from '../../components/page-info/page-info';
import { appState } from '../../state/app-state';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';

import './garage.css';

export async function createGarage(): Promise<void> {
  const container = createElement({ tag: 'div', className: 'container' });

  document.body.append(container);

  const infoElements = createInfoElements({
    title: 'Garage',
    page: appState.garagePage,
    total: appState.garage.length,
    totalText: 'Total Cars',
  });
  container.append(infoElements.container);

  const formsContainer = createElement({ tag: 'div', className: 'forms-container' });
  container.append(formsContainer);

  const createForm = createCarForm({ isUpdate: false });
  const updateForm = createCarForm({ isUpdate: true, disabled: true });

  formsContainer.append(createForm, updateForm);

  const garageList = createGarageList();
  container.append(garageList.container);

  startGarageController();

  eventState.on('garage:refresh', () => {
    infoElements.totalInfo.textContent = `Total Cars: ${carState.cars.length}`;
  });

  try {
    await garageList.render();
    eventState.emit('garage:refresh');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error while rendering garage:', error.message);
    } else {
      console.error('Unknown error while rendering garage:', error);
    }
  }
}
