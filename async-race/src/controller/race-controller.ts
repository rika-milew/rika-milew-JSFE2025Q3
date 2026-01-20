import {
  resetAllCarsPositions,
  resetCarPosition,
} from '@components/car/car-animation/reset-car-position';
import { carState } from '@state/car-state';
import { eventState } from '@state/events/event-state';
import { setEngineButtons } from '@utils/set-car-buttons';
import { setGarageButtons } from '@utils/set-garage-buttons';

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

    setGarageButtons(false, true, false);

    const carsOnPage = carState.getAllOnCurrentPage();

    carsOnPage.forEach((car) => {
      setEngineButtons(car.id, false, false);
      eventState.emit('car:start', { id: car.id });
    });
  });

  eventState.on('garage:reset', () => {
    carState.isRacing = false;
    setGarageButtons(true, true, true);

    carState.garageSessionId += 1;
    carState.winner = undefined;

    const carsOnPage = carState.getAllOnCurrentPage();
    carsOnPage.forEach((car) => {
      resetCarPosition(car.id);
    });

    carState.winner = undefined;
  });
}
