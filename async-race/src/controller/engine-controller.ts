import { getEngineParams } from '@api/engine/get-engine-params';
import { startEngine } from '@api/engine/start-engine';
import { animateCar, stopCarAnimation } from '@components/car/car-animation/animate-car';
import { resetCarPosition } from '@components/car/car-animation/reset-car-position';
import { errorPopup } from '@components/popup/error/error';
import { winnerPopup } from '@components/popup/winner/winner';
import { POPUP_MESSAGES } from '@data/error-messages';
import { carState } from '@state/car-state';
import { eventState } from '@state/events/event-state';
import { checkRaceEnd } from '@utils/finish-race';
import { handleErrors } from '@utils/handle-errors';
import { setEngineButtons } from '@utils/set-car-buttons';

let isEngineControllerStarted = false;

export function startEngineController(): void {
  if (isEngineControllerStarted) {
    return;
  }

  isEngineControllerStarted = true;

  eventState.on('car:start', async (payload) => {
    if (!payload) {
      return;
    }
    await handleCarStart(payload.id);
  });

  eventState.on('car:reset', async (payload) => {
    if (!payload) {
      return;
    }

    const carId = payload.id;
    stopCarAnimation(carId);
    await handleErrors(() => startEngine(carId, 'stopped'), POPUP_MESSAGES.carResetFailed(carId));
    resetCarPosition(carId);
    setEngineButtons(carId, true, false);
  });
}

async function handleCarStart(carId: number): Promise<void> {
  const car = carState.getById(carId);

  if (!car) {
    return;
  }

  if (car.isDriving) {
    return;
  }

  car.isDriving = true;

  const engineData = await handleErrors(
    () => startEngine(carId, 'started'),
    POPUP_MESSAGES.carStartFailed(carId),
  );

  if (!engineData) {
    car.isDriving = false;
    stopCarAnimation(carId);
    if (!carState.isRacing) {
      setEngineButtons(carId, true, false);
    }
    return;
  }

  animateCar(carId, engineData.velocity, engineData.distance, (succeeded) => {
    car.isDriving = false;
    if (carState.isRacing) {
      if (succeeded && !carState.winner) {
        carState.winner = car;
        winnerPopup.show(car.name);
      }
      checkRaceEnd();
    }
  });

  if (!carState.isRacing) {
    setEngineButtons(carId, false, true);
  }

  const sessionId = carState.garageSessionId;

  try {
    await getEngineParams(carId);
    if (carState.garageSessionId !== sessionId) {
      return;
    }
  } catch (error) {
    if (carState.garageSessionId !== sessionId) {
      return;
    }
    checkRaceEnd();

    if (error instanceof Error && error.message.includes('broken down')) {
      car.isDriving = false;
      stopCarAnimation(carId);
      setEngineButtons(carId, false, true);
      errorPopup.show(
        `Car with id ${carId} has been stopped suddenly. It's engine was broken down.`,
      );
      return;
    }

    car.isDriving = false;
    stopCarAnimation(carId);
    errorPopup.show(`Car ${carId} drive failed.`);
  }
}
