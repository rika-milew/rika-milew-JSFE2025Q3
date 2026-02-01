import { carState } from '@/state/car-state';
import { audioPLayer } from '@/utils/audio-player';

export function updateRaceSound(): void {
  const anyDriving: boolean = carState.cars.some((car) => car.isDriving);

  if (anyDriving) {
    audioPLayer.playRaceLoop();
  } else {
    audioPLayer.stopRaceLoop();
  }
}
