import { createCarDiv } from '../../components/car/car';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';
import { clearContainer } from '../../utils/clear-container';
import { createElement } from '../../utils/create-element';

export const garageContainer = createElement({ tag: 'div', className: 'garage-container' });

const garageList: { render: () => void } = ((): { render: () => void } => {
  function render(): void {
    clearContainer(garageContainer);
    carState.cars.forEach((car) => {
      garageContainer.append(createCarDiv(car));
    });
  }

  eventState.on('garage:refresh', () => {
    render();
  });

  return { render };
})();

export { garageList };
