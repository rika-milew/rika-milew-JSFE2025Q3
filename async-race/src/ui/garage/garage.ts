import { startGarageController } from './garage-controller';
import { createGarageList } from './garage-list';
import { createCarForm } from '../../components/car-form/car-form';
import { createInfoElements } from '../../components/page-info/page-info';
import { appState } from '../../state/app-state';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';

import './garage.css';

export function createGarage(): void {
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
}
