import { carElements } from '@state/car-elements';
import { audioPLayer } from '@utils/audio-player';
import { setEngineButtons } from '@utils/set-car-buttons';

export function resetCar(carId: number): void {
  const carObject = carElements[carId];

  if (carObject.animationId !== undefined) {
    cancelAnimationFrame(carObject.animationId);
    carObject.animationId = undefined;
  }

  carObject.svg.style.transform = 'translateX(0)';

  audioPLayer.stopSound('brake');
  carObject.track.classList.remove('blink');

  setEngineButtons(carId, true, false);
}
