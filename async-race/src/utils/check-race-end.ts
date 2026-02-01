import { carState } from '@/state/car-state';
import { setEngineButtons } from '@/utils/set-car-buttons';
import { setGarageButtons } from '@/utils/set-garage-buttons';

import type { CarStateItem } from '@/types/types';

export function checkRaceEnd(): void {
  const carsOnPage: CarStateItem[] | undefined = carState.getAllOnCurrentPage();
  const allStopped: boolean = carsOnPage.every((c) => !c.isDriving);

  if (allStopped && carState.isRacing) {
    carState.isRacing = false;
    setGarageButtons(true, true, true);

    carsOnPage.forEach((car) => {
      setEngineButtons(car.id, false, true);
    });
  }
}
