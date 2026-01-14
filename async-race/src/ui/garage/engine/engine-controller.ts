import { startDriveMode } from '../../../api/engine/start-drive-mode';
import { startAndStopEngine } from '../../../api/engine/start-engine';
import { animateCar } from '../../../components/car/car-animation/animate-car';
import { resetCar } from '../../../components/car/car-animation/reset-car';
import { stopCarAnimation } from '../../../components/car/car-animation/stop-car-animation';
import { errorPopup } from '../../../components/error/error';
import { eventState } from '../../../state/events/event-state';
import { setEngineButtons } from '../../../utils/set-car-buttons';

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

    try {
      await startAndStopEngine(carId, 'stopped');
      resetCar(carId);
      setEngineButtons(carId, true, false);
    } catch (error) {
      if (error instanceof Error) {
        errorPopup.show(`Car with id ${carId} failed to reset: ${error.message}`);
      }
    }
  });
}

async function handleCarStart(carId: number): Promise<void> {
  try {
    const { velocity, distance } = await startAndStopEngine(carId, 'started');

    animateCar(carId, velocity, distance);
    setEngineButtons(carId, false, true);
    await startDriveMode(carId);
  } catch (error) {
    if (error instanceof Error) {
      const isServerError = error.message.includes('broken down') || error.message.includes('500');

      if (isServerError) {
        errorPopup.show(
          `Car with id ${carId} has been stopped suddenly. It's engine was broken down.`,
        );
        stopCarAnimation(carId);
        setEngineButtons(carId, false, true);
        return;
      }

      errorPopup.show(`Car ${carId} failed: ${error.message}`);
    }
  }
}
