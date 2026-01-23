import { carState } from '@/state/car-state';
import { setEngineButtons } from '@/utils/set-car-buttons';
import { setGarageButtons } from '@/utils/set-garage-buttons';

export function checkRaceEnd(): void {
  const carsOnPage = carState.getAllOnCurrentPage();
  const allStopped = carsOnPage.every((c) => !c.isDriving);

  if (allStopped && carState.isRacing) {
    carState.isRacing = false;
    setGarageButtons(true, true, true);

    carsOnPage.forEach((car) => {
      setEngineButtons(car.id, false, true);
    });
  }
}
