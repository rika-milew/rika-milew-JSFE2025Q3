import { getCarStore, setCarAnimationId } from '@/state/car-store';
import { audioPLayer } from '@utils/audio-player';
import { setEngineButtons } from '@utils/set-car-buttons';

export function stopCarAnimation(carId: number): void {
  const carObject = getCarStore(carId);

  if (!carObject) {
    return;
  }

  if (carObject.animationId !== undefined) {
    cancelAnimationFrame(carObject.animationId);
    setCarAnimationId(carId, undefined);
  }

  audioPLayer.stopSound('race');
  audioPLayer.playSound('brake');
  carObject.track.classList.remove('blink');

  setEngineButtons(carId, false, true);
}
