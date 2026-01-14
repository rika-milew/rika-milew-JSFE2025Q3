import { getCarStore } from '@/state/car-store';
import { audioPLayer } from '@utils/audio-player';
import { setEngineButtons } from '@utils/set-car-buttons';

export function resetCar(carId: number): void {
  const carObject = getCarStore(carId);

  if (!carObject) {
    return;
  }

  if (carObject.animationId !== undefined) {
    cancelAnimationFrame(carObject.animationId);
    carObject.animationId = undefined;
  }

  carObject.svg.style.transform = 'translateX(0)';

  audioPLayer.stopSound('race');
  audioPLayer.stopSound('brake');
  carObject.track.classList.remove('blink');

  setEngineButtons(carId, true, false);
}
