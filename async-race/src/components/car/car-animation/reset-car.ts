import { getCarStore } from '@/state/car-store';
import { audioPLayer } from '@utils/audio-player';
import { setEngineButtons } from '@utils/set-car-buttons';

export function resetCar(carId: number): void {
  const carElement = getCarStore(carId);

  if (!carElement) {
    return;
  }

  if (carElement.animationId !== undefined) {
    cancelAnimationFrame(carElement.animationId);
    carElement.animationId = undefined;
  }

  carElement.svg.style.transform = 'translateX(0)';

  audioPLayer.stopSound('race');
  audioPLayer.stopSound('brake');
  carElement.track.classList.remove('blink');

  setEngineButtons(carId, true, false);
}
