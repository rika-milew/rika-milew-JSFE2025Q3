import { carState } from '@/state/car-state';
import { setEngineButtons } from '@/utils/set-car-buttons';
import { resetAllCarsPositions, resetCarPosition } from '@components/car/car-animation/reset-car';
import { eventState } from '@state/events/event-state';

let isRaceControllerStarted = false;

export function startRaceController(): void {
  if (isRaceControllerStarted) {
    return;
  }
  isRaceControllerStarted = true;

  eventState.on('garage:race', () => {
    resetAllCarsPositions();
    carState.winner = undefined;
    carState.isRacing = true;
    const carsOnPage = carState.getAllOnCurrentPage();
    carsOnPage.forEach((car) => {
      setEngineButtons(car.id, false, false);
      eventState.emit('car:start', { id: car.id });
    });
  });

  eventState.on('garage:reset', () => {
    const carsOnPage = carState.getAllOnCurrentPage();
    carState.isRacing = false;
    carsOnPage.forEach((car) => {
      resetCarPosition(car.id);
    });

    carState.winner = undefined;
  });
}
