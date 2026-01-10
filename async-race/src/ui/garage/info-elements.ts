import { createInfoElements } from '../../components/page-info/page-info';
import { carState } from '../../state/car-state';
import { eventState } from '../../state/event-state';

export const infoElements = createInfoElements({
  title: 'Garage',
  page: 1,
  total: carState.cars.length,
  totalText: 'Total Cars',
});

eventState.on('garage:refresh', () => {
  infoElements.totalInfo.textContent = `Total Cars: ${carState.cars.length}`;
});
