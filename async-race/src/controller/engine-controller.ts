import { getEngineParams } from '@/api/engine/get-engine-params';
import { errorPopup } from '@/components/error/error';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { handleErrors } from '@/utils/handle-errors';
import { startEngine } from '@api/engine/start-engine';
import { animateCar, stopCarAnimation } from '@components/car/car-animation/animate-car';
import { resetCar } from '@components/car/car-animation/reset-car';
import { eventState } from '@state/events/event-state';
import { setEngineButtons } from '@utils/set-car-buttons';

export function startEngineController(): void {
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

    resetCar(carId);
    setEngineButtons(carId, true, false);
  });
}

async function handleCarStart(carId: number): Promise<void> {
  const engineData = await handleErrors(
    () => startEngine(carId, 'started'),
    POPUP_MESSAGES.carStartFailed(carId),
  );

  if (!engineData) {
    stopCarAnimation(carId);
    setEngineButtons(carId, true, false);
    return;
  }

  animateCar(carId, engineData.velocity, engineData.distance);
  setEngineButtons(carId, false, true);

  try {
    await getEngineParams(carId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('broken down')) {
      stopCarAnimation(carId);
      setEngineButtons(carId, false, true);
      errorPopup.show(
        `Car with id ${carId} has been stopped suddenly. It's engine was broken down..`,
      );
      return;
    }
    errorPopup.show(`Car ${carId} drive failed.}`);
  }
}
