import { stopCarAnimation } from '@components/car/car-animation/stop-car-animation';
import { carState } from '@state/car-state';
import { updateRaceSound } from '@utils/play-race-sound';
import { setEngineButtons } from '@utils/set-car-buttons';
import { setRaceButton } from '@utils/set-garage-buttons';

export function resetCarState(carId: number): void {
  const car = carState.getById(carId);
  if (!car) {
    return;
  }

  car.isDriving = false;

  setRaceButton();
  updateRaceSound();
  stopCarAnimation(carId);

  if (!carState.isRacing) {
    setEngineButtons(carId, false, true);
  }
}
