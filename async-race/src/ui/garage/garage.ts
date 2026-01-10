import { startGarageController } from './garage-controller';
import { garageContainer } from './garage-list';
import { infoElements } from './info-elements';
import { loadDefaultCars } from './init-garage';
import { createCarForm } from '../../components/car-form/car-form';
// import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';

import './garage.css';

export async function createGarage(): Promise<void> {
  const main = createElement({ tag: 'div', className: 'main' });
  const container = createElement({ tag: 'div', className: 'container' });

  document.body.append(main);
  main.append(container);

  if (!container.contains(infoElements.container)) {
    container.append(infoElements.container);
  }

  const formsContainer = createElement({ tag: 'div', className: 'forms-container' });
  container.append(formsContainer);

  const createForm = createCarForm({ isUpdate: false });
  const updateForm = createCarForm({ isUpdate: true, disabled: true });

  formsContainer.append(createForm, updateForm);

  await loadDefaultCars();

  // console.log(carState);

  if (!container.contains(garageContainer)) {
    container.append(garageContainer);
  }

  startGarageController();

  eventState.emit('garage:refresh');
}
