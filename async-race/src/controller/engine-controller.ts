import { startEngine } from '@/api/engine/start-engine';
import { resetCarPosition } from '@/components/car/car-animation/reset-car-position';
import { stopCarAnimation } from '@/components/car/car-animation/stop-car-animation';
import { handleCarStart } from '@/controller/helpers/handle-car-start';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { carState } from '@/state/car-state';
import { eventState } from '@/state/events/event-state';
import { handleErrors } from '@/utils/handle-errors';
import { setEngineButtons } from '@/utils/set-car-buttons';

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
    const car = carState.getById(carId);
    stopCarAnimation(carId);

    await handleErrors(
      () => startEngine(carId, 'stopped'),
      POPUP_MESSAGES.carResetFailed(carId, car?.name),
    );

    resetCarPosition(carId);
    setEngineButtons(carId, true, false);
  });
}
