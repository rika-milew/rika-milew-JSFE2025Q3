import { carState } from '@/state/car-state';
import { getCarStore } from '@/state/car-store';
import { updateRaceSound } from '@/utils/play-race-sound';
import { setEngineButtons } from '@/utils/set-car-buttons';
import { setRaceButton } from '@/utils/set-garage-buttons';

import type { CarStateItem, CarStore } from '@/types/types';

export function stopCarAnimation(carId: number): void {
  const car: CarStateItem | undefined = carState.getById(carId);

  if (!car) {
    return;
  }

  const carElement: CarStore | undefined = getCarStore(carId);

  if (carElement?.animationId !== undefined) {
    cancelAnimationFrame(carElement.animationId);
    carElement.animationId = undefined;
  }

  car.isDriving = false;
  setRaceButton();
  updateRaceSound();

  if (carElement) {
    carElement.trackLine.classList.remove('blink');
    if (!carState.isRacing) {
      setEngineButtons(carId, false, true);
    }
  }
}
