import { carElements } from '../../../state/car-elements';
import { audioPLayer } from '../../../utils/audio-player';
import { setEngineButtons } from '../../../utils/set-car-buttons';

export function stopCarAnimation(carId: number): void {
  const carObject = carElements[carId];

  if (carObject.animationId !== undefined) {
    cancelAnimationFrame(carObject.animationId);
    carObject.animationId = undefined;
  }

  audioPLayer.playSound('brake');
  carObject.track.classList.remove('blink');

  setEngineButtons(carId, false, true);
}
