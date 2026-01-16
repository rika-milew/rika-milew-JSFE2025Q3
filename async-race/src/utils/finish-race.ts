import { carState } from '@/state/car-state';

export function checkRaceEnd(): void {
  const carsOnPage = carState.getAllOnCurrentPage();
  const allStopped = carsOnPage.every((c) => !c.isDriving);

  if (allStopped && carState.isRacing) {
    carState.isRacing = false;
    // console.log('Race finished');
  }
}
