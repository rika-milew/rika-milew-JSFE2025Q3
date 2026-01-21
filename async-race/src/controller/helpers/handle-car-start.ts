import { getEngineParams } from '@/api/engine/get-engine-params';
import { startEngine } from '@/api/engine/start-engine';
import { animateCar } from '@/components/car/car-animation/animate-car';
import { errorPopup } from '@/components/popup/error/error';
import { winnerPopup } from '@/components/popup/winner/winner';
import { resetCarState } from '@/controller/helpers/reset-car-state';
import { MILLISECONDS } from '@/data/constants';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { carState } from '@/state/car-state';
import { handleWinner } from '@/ui/winners/helpers/handle-winner';
import { audioPLayer } from '@/utils/audio-player';
import { checkRaceEnd } from '@/utils/check-race-end';
import { updateRaceSound } from '@/utils/play-race-sound';
import { setEngineButtons } from '@/utils/set-car-buttons';
import { setRaceButton } from '@/utils/set-garage-buttons';

export async function handleCarStart(carId: number): Promise<void> {
  const car = carState.getById(carId);

  if (!car || car.isDriving) {
    return;
  }

  car.isDriving = true;
  setRaceButton();
  updateRaceSound();

  const engineData = await startEngine(carId, 'started');

  if (!engineData) {
    resetCarState(car.id);
    errorPopup.show(POPUP_MESSAGES.carStartFailed(carId, car.name));
    return;
  }

  animateCar(carId, engineData.velocity, engineData.distance, (succeeded, time) => {
    car.isDriving = false;
    setRaceButton();
    updateRaceSound();

    if (carState.isRacing) {
      if (succeeded && !carState.winner) {
        carState.winner = car;
        winnerPopup.show(car.name);
        const finishTime = time ?? engineData.distance / engineData.velocity / MILLISECONDS;
        handleWinner(car, finishTime);
      }

      checkRaceEnd();
      audioPLayer.playOnce('brake');
    }
  });

  if (!carState.isRacing) {
    setEngineButtons(carId, false, true);
  }

  const sessionId = carState.garageSessionId;

  const engineParams = await getEngineParams(carId);

  if (carState.garageSessionId !== sessionId) {
    return;
  }

  if (!engineParams) {
    checkRaceEnd();
    resetCarState(car.id);
    audioPLayer.playOnce('brake');

    errorPopup.show(
      `The ${car.name} car (ID ${carId}) has been stopped suddenly. It's engine was broken down.`,
    );

    return;
  }
}
